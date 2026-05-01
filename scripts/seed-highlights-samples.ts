import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";

const TABLE = process.env.DYNAMODB_TABLE_NAME || "High5Give5Content";
const REGION = process.env.AWS_REGION || "us-east-1";

const docClient = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: REGION }),
  { marshallOptions: { removeUndefinedValues: true } }
);

type Highlight = { value: string; label: string };

const SAMPLES: Record<string, Highlight[]> = {
  kenya: [
    { value: "Wells + Meals", label: "clean water and feeding programs combined" },
  ],
  philippines: [
    { value: "350", label: "children fed in Manila slums" },
    { value: "$5 = 50", label: "meals provided" },
  ],
  colombia: [
    { value: "50", label: "families receive monthly food packages" },
    { value: "Weekly", label: "hot meals for children & single mothers" },
    { value: "7M+", label: "displaced people Colombia hosts" },
  ],
  moldova: [
    { value: "800", label: "loaves of bread distributed daily" },
    { value: "5 days", label: "per week of distribution" },
    { value: "Rural villages", label: "around Sărata-Galbenă, near Chișinău" },
    { value: "After-school", label: "homework + meals for children" },
  ],
  albania: [
    { value: "50", label: "meals provided per $5" },
    { value: "Tirana + 5", label: "villages reached" },
    { value: "Ancora Intl.", label: "ground partner organization" },
    { value: "Widows · Orphans", label: "elderly & abandoned cared for" },
    { value: "Daily", label: "visits to those who feel forgotten" },
  ],
  greece: [
    { value: "50", label: "meals per $5" },
    { value: "Athens", label: "primary base of operations" },
    { value: "Daily", label: "soup kitchen service" },
    { value: "Refugees", label: "& homeless individuals served" },
    { value: "Multi-faith", label: "outreach approach" },
    { value: "Hot meals", label: "rain or shine" },
  ],
};

async function main() {
  for (const [slug, highlights] of Object.entries(SAMPLES)) {
    const { Item } = await docClient.send(
      new GetCommand({ TableName: TABLE, Key: { PK: "COUNTRY", SK: slug } })
    );
    if (!Item) {
      console.log(`  ${slug}: NOT FOUND in DynamoDB — skipping`);
      continue;
    }
    await docClient.send(
      new PutCommand({ TableName: TABLE, Item: { ...Item, highlights } })
    );
    console.log(`  ${slug}: ${highlights.length} highlights seeded`);
  }
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
