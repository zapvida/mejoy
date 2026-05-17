import { createEmagrecimentoReportViaApi } from "../support/triage";
import { expect, test } from "../support/test";

test.describe("MeJoy report flow @pr-regression", () => {
  test("report renders the new decision fold and inline checkout shell", async ({
    page,
    request,
  }) => {
    const { reportPath } = await createEmagrecimentoReportViaApi(request);

    await page.goto(reportPath);

    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Plano MeJoy esta pronto/i,
    );
    await expect(
      page.getByRole("link", {
        name: /Solicitar orientação médica gratuita de 10 min/i,
      }),
    ).toHaveAttribute(
      "href",
      /wa\.me\/5547999009923\?text=Atendimento%20MeJoy/i,
    );
    await expect(
      page.getByText("Escolha seu programa e confirme com seguranca").first(),
    ).toBeVisible();

    await page
      .getByRole("button", {
        name: /Confirmar meu programa agora|Abrir checkout seguro|Continuar nesta pagina|Continuar com meu plano/i,
      })
      .first()
      .click();
    await expect(page.locator("#report-inline-checkout")).toBeVisible();
    await expect(page.getByText("Alterar trilha ou plano")).toBeVisible();
  });

  test("standalone emagrecimento checkout stays reachable", async ({
    request,
  }) => {
    const { triageId } = await createEmagrecimentoReportViaApi(request);
    const response = await request.get(
      `/emagrecimento/checkout?plano=programa-3m&reportId=${encodeURIComponent(triageId)}`,
    );

    expect(response.ok()).toBeTruthy();
  });
});
