import fs from "fs/promises";
import path from "path";

function escapeCsv(value) {
  if (value == null) return "";
  const stringValue = String(value);
  const escaped = stringValue.replace(/"/g, '""');
  return `"${escaped}"`;
}

export async function saveLeadToCsv(lead) {
  const filePath = path.join(process.cwd(), "data", "leads.csv");
  await fs.mkdir(path.dirname(filePath), { recursive: true });

  const header = "name,email,phone,grade\n";
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, header, "utf8");
  }

  const row =
    [lead.name, lead.email, lead.phone, lead.grade].map(escapeCsv).join(",") +
    "\n";
  await fs.appendFile(filePath, row, "utf8");
}
