DROP TABLE IF EXISTS joketable;
CREATE TABLE joketable(

id SERIAL PRIMARY KEY,

type VARCHAR(255),
setup VARCHAR(255),
punchline VARCHAR(255)


);