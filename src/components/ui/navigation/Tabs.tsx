type Tab = {
  label: string;
  value: string;
};

type TabsProps = {
  tabs: Tab[];
  active: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (_value: string) => void;
};

export default function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="flex space-x-2">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 rounded ${
            active === tab.value
              ? 'bg-brand text-white'
              : 'bg-muted text-muted-foreground hover:bg-muted'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
