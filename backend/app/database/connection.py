import mysql.connector
import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

# Project root:
# Ecommerce-FullStack-Analytics/
PROJECT_ROOT = Path(__file__).resolve().parents[3]


def get_connection():

    ssl_ca = os.getenv("AIVEN_MYSQL_SSL_CA")

    if ssl_ca:
        ssl_ca_path = Path(ssl_ca)

        # If the path is relative, find the certificate
        # inside the project's dataset folder.
        if not ssl_ca_path.is_absolute():

            certificate_path = (
                PROJECT_ROOT
                / "dataset"
                / ssl_ca_path.name
            )

            if certificate_path.exists():
                ssl_ca = str(certificate_path.resolve())

    connection = mysql.connector.connect(
        host=os.getenv("AIVEN_MYSQL_HOST"),
        port=int(os.getenv("AIVEN_MYSQL_PORT")),
        user=os.getenv("AIVEN_MYSQL_USER"),
        password=os.getenv("AIVEN_MYSQL_PASSWORD"),
        database=os.getenv("AIVEN_MYSQL_DATABASE"),
        ssl_ca=ssl_ca
    )

    return connection