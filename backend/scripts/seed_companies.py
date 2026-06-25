import json
import sys
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))
from app.db.database import SessionLocal
from app.models.company import Company


BASE_DIR = Path(__file__).resolve().parent.parent
SAMPLE_DATA_FILE = BASE_DIR / "sample_data" / "companies.json"


def normalize_symbol(symbol: str) -> str:
    return symbol.strip().upper()


def normalize_exchange(exchange: str) -> str:
    return exchange.strip().upper()


def seed_companies():
    if not SAMPLE_DATA_FILE.exists():
        raise FileNotFoundError(f"Sample data file not found: {SAMPLE_DATA_FILE}")

    with SAMPLE_DATA_FILE.open("r", encoding="utf-8") as file:
        companies = json.load(file)

    db = SessionLocal()

    created_count = 0
    skipped_count = 0

    try:
        for company_data in companies:
            symbol = normalize_symbol(company_data["symbol"])

            existing_company = (
                db.query(Company)
                .filter(Company.symbol == symbol)
                .first()
            )

            if existing_company:
                print(f"SKIPPED: {symbol} already exists")
                skipped_count += 1
                continue

            company = Company(
                symbol=symbol,
                name=company_data["name"].strip(),
                exchange=normalize_exchange(company_data["exchange"]),
                sector=company_data.get("sector"),
                industry=company_data.get("industry"),
                country=company_data.get("country", "India"),
            )

            db.add(company)
            created_count += 1
            print(f"CREATED: {symbol} - {company.name}")

        db.commit()

        print("\nSeed completed successfully.")
        print(f"Created: {created_count}")
        print(f"Skipped: {skipped_count}")

    except Exception:
        db.rollback()
        print("\nSeed failed. Database rolled back.")
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_companies()