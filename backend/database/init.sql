CREATE TABLE surveys (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    analyze_url TEXT,
    has_important_question BOOLEAN DEFAULT FALSE
);
