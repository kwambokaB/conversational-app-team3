export const tokens = `CREATE TABLE IF NOT EXISTS tokens (
    id INT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id INT,
    token VARCHAR,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
`;