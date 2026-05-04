import { createHmac, timingSafeEqual } from "node:crypto";

import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

export const config = { api: { bodyParser: false } };

const schema = z.object({
	event: z.enum([
		"document.finalized",
		"prescription.redeemed",
		"pharmacy.invited",
		"pharmacy.onboarded",
	]),
	eventId: z.string().min(1),
	idempotencyKey: z.string().min(1),
	correlationId: z.string().min(1),
	sourceSystem: z.string().min(1),
	sourceJourney: z.string().min(1),
	contractVersion: z.string().optional(),
	occurredAt: z.string().optional(),
	data: z.record(z.string(), z.unknown()),
});

type EcosystemEventPayload = z.infer<typeof schema>;

function safeCompareHex(received: string, expected: string) {
	const receivedBuffer = Buffer.from(received, "hex");
	const expectedBuffer = Buffer.from(expected, "hex");
	return (
		receivedBuffer.length === expectedBuffer.length &&
		timingSafeEqual(receivedBuffer, expectedBuffer)
	);
}

function getSupabaseConfig() {
	const url =
		process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
	const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
	if (!url || !key) return null;
	return { url, key };
}

async function persistEvent(payload: EcosystemEventPayload) {
	const config = getSupabaseConfig();
	if (!config) {
		return { ok: false, skipped: true, reason: "SUPABASE_NOT_CONFIGURED" };
	}

	const { createClient } = await import("@supabase/supabase-js");
	const supabase = createClient(config.url, config.key, {
		auth: { persistSession: false },
		db: { schema: "public" },
	});

	const existing = await supabase
		.from("ecosystem_events")
		.select("event_id")
		.eq("event_id", payload.eventId)
		.maybeSingle();

	if (existing.data?.event_id) {
		return { ok: true, deduped: true };
	}

	const { error } = await supabase.from("ecosystem_events").insert({
		event_id: payload.eventId,
		event_name: payload.event,
		correlation_id: payload.correlationId,
		idempotency_key: payload.idempotencyKey,
		source_system: payload.sourceSystem,
		source_journey: payload.sourceJourney,
		contract_version: payload.contractVersion || "1.0",
		occurred_at: payload.occurredAt || new Date().toISOString(),
		payload: payload.data,
	});

	if (error) {
		if (error.code === "42P01") {
			return { ok: false, skipped: true, reason: "TABLE_NOT_FOUND" };
		}
		return { ok: false, reason: error.message };
	}

	return { ok: true };
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== "POST") {
		return res.status(405).json({ ok: false, error: "Use POST" });
	}

	const secret = process.env.MEJOY_ECOSYSTEM_SECRET;
	if (!secret || secret.trim() === "") {
		return res
			.status(500)
			.json({ ok: false, error: "MEJOY_ECOSYSTEM_SECRET não configurado" });
	}

	try {
		const rawBody = await buffer(req);
		const rawText = rawBody.toString("utf8");
		const receivedSignature = req.headers["x-ecosystem-signature"];
		const signature =
			typeof receivedSignature === "string" ? receivedSignature : null;

		if (!signature) {
			return res
				.status(401)
				.json({ ok: false, error: "Assinatura não fornecida" });
		}

		const expectedSignature = createHmac("sha256", secret)
			.update(rawText)
			.digest("hex");

		if (!safeCompareHex(signature, expectedSignature)) {
			return res.status(401).json({ ok: false, error: "Assinatura inválida" });
		}

		const payload = schema.parse(JSON.parse(rawText));
		const persisted = await persistEvent(payload);

		return res.status(200).json({
			ok: true,
			event: payload.event,
			eventId: payload.eventId,
			persisted: persisted.ok,
			deduped: "deduped" in persisted ? persisted.deduped : false,
			skipped: "skipped" in persisted ? persisted.skipped : false,
			reason: "reason" in persisted ? persisted.reason : null,
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return res.status(400).json({
				ok: false,
				error: "Payload inválido",
				issues: error.flatten(),
			});
		}

		return res.status(500).json({
			ok: false,
			error:
				error instanceof Error
					? error.message
					: "Falha ao processar evento do ecossistema",
		});
	}
}
