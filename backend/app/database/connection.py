import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()


def get_connection():
    connection = mysql.connector.connect(
        host=os.getenv("AIVEN_MYSQL_HOST"),
        port=int(os.getenv("AIVEN_MYSQL_PORT")),
        user=os.getenv("AIVEN_MYSQL_USER"),
        password=os.getenv("AIVEN_MYSQL_PASSWORD"),
        database=os.getenv("AIVEN_MYSQL_DATABASE"),
        ssl_ca=os.getenv("AIVEN_MYSQL_SSL_CA")
    )

    return connection