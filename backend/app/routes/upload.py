from fastapi import UploadFile, File, HTTPException
from fastapi import APIRouter, Depends
from app.auth.dependencies import get_current_user
from app.database.connection import get_connection
import pandas as pd
import io

router = APIRouter(
    prefix="/api/upload",
    tags=["Upload"],
    dependencies=[Depends(get_current_user)]
)


@router.post("/")
async def upload_csv(file: UploadFile = File(...)):

    # Check file type
    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are allowed."
        )

    try:

        # Read uploaded CSV
        contents = await file.read()

        df = pd.read_csv(
            io.BytesIO(contents)
        )

        # Required columns
        required_columns = [
            "Order_ID",
            "Order_Date",
            "Customer_ID",
            "Category",
            "Product",
            "Quantity",
            "Sales",
            "Discount",
            "Profit",
            "Region",
            "City",
            "Payment_Mode"
        ]

        # Check missing columns
        missing_columns = [
            column
            for column in required_columns
            if column not in df.columns
        ]

        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail=f"Missing columns: {', '.join(missing_columns)}"
            )

        # Remove empty Order_ID rows
        df = df.dropna(
            subset=["Order_ID"]
        )

        # Convert date
        df["Order_Date"] = pd.to_datetime(
            df["Order_Date"],
            errors="coerce"
        ).dt.date

        # Remove invalid dates
        df = df.dropna(
            subset=["Order_Date"]
        )

        connection = get_connection()
        cursor = connection.cursor()

        # INSERT IGNORE skips duplicate Order_ID values
        insert_query = """
        INSERT IGNORE INTO sales (
            Order_ID,
            Order_Date,
            Customer_ID,
            Category,
            Product,
            Quantity,
            Sales,
            Discount,
            Profit,
            Region,
            City,
            Payment_Mode
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """

        data = []

        for _, row in df.iterrows():

            data.append((
                str(row["Order_ID"]),
                row["Order_Date"],
                str(row["Customer_ID"]),
                str(row["Category"]),
                str(row["Product"]),
                int(row["Quantity"]),
                float(row["Sales"]),
                float(row["Discount"]),
                float(row["Profit"]),
                str(row["Region"]),
                str(row["City"]),
                str(row["Payment_Mode"])
            ))

        cursor.executemany(
            insert_query,
            data
        )

        connection.commit()

        rows_inserted = cursor.rowcount
        rows_skipped = len(data) - rows_inserted

        cursor.close()
        connection.close()

        return {
            "message": "CSV processed successfully",
            "filename": file.filename,
            "total_rows": len(data),
            "rows_inserted": rows_inserted,
            "rows_skipped": rows_skipped
        }

    except HTTPException:
        raise

    except Exception as e:

        print("UPLOAD ERROR:", str(e))

        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {str(e)}"
        )