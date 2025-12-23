import type { SavedScenario, Scenario } from "@/types";
import { sql } from "@vercel/postgres";

export async function createScenariosTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS scenarios (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      userId TEXT NOT NULL,
      scenario JSONB NOT NULL,
      type TEXT NOT NULL,
      contraintes TEXT,
      title TEXT,
      createdAt TIMESTAMP DEFAULT NOW(),
    );

    CREATE INDEX IF NOT EXISTS idx_scenarios_user_id ON scenarios(user_id);
    CREATE INDEX IF NOT EXISTS idx_scenarios_created_at ON scenarios(created_at DESC);
  `;
}

export async function saveScenario(
  userId: string,
  scenario: Scenario,
  type: string,
  contraintes?: string,
  title?: string
): Promise<SavedScenario> {
  const result = await sql`
    INSERT INTO scenarios (user_id, scenario, type, contraintes, title)
    VALUES (${userId}, ${scenario}, ${type}, ${contraintes}, ${title})
    RETURNING *
  `;

  const row = result.row[0];
  return {
    id: row.id,
    userId: row.user_id,
    scenario: row.scenario,
    type: row.type,
    contraintes: row.contraintes,
    title: row.title,
    createdAt: row.created_at,
  };
}

export async function getUserScenarios(userId: string, limit: number = 50) {
  const result = await sql`
    SELECT * FROM scenarios
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit};
  `;

  return result.rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    scenario: row.scenario,
    type: row.type,
    contraintes: row.contraintes,
    title: row.title,
    createdAt: row.created_at,
  }));
}

export async function getScenarioById(id: string, userId: string) {
  const result = await sql`
    SELECT * FROM scenarios
    WHERE id = ${id} AND user_id = ${userId};
  `;

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.row[0];

  return {
    id: row.id,
    userId: row.user_id,
    scenario: row.scenario,
    type: row.type,
    contraintes: row.contraintes,
    title: row.title,
    createdAt: row.created_at,
  };
}

export async function deleteScenario(id: string, userId: string) {
  const result = await sql`
    DELETE FROM scenarios
    WHERE id = ${id} AND user_id = ${userId};
  `;

  return result.rowCount > 0;
}

export async function updateScenarioTitle(
  id: string,
  userId: string,
  title: string
) {
  const result = await sql`
    UPDATE scenarios
    SET title = ${title}
    WHERE id = ${id} AND user_id = ${userId};
  `;

  return result.rowCount > 0;
}
