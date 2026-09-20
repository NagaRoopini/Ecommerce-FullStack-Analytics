from app.database.connection import get_connection


def setup_database():

    connection = get_connection()
    cursor = connection.cursor()

    create_table_query = """
    CREATE TABLE IF NOT EXISTS sales (
        Order_ID VARCHAR(20) PRIMARY KEY,
        Order_Date DATE,
        Customer_ID VARCHAR(20),
        Category VARCHAR(50),
        Product VARCHAR(100),
        Quantity INT,
        Sales DECIMAL(15,2),
        Discount DECIMAL(5,2),
        Profit DECIMAL(15,2),
        Region VARCHAR(20),
        City VARCHAR(50),
        Payment_Mode VARCHAR(30)
    )
    """

    cursor.execute(create_table_query)
    create_users_table_query = """
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """

    cursor.execute(create_users_table_query)
    connection.commit()

    print("Sales table created successfully!")

    cursor.close()
    connection.close()


if __name__ == "__main__":
    setup_database()