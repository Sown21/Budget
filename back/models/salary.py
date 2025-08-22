from sqlalchemy.orm import Mapped, mapped_column
from core.database import Base
import datetime

class Salary(Base):
    __tablename__ = "salaries"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    amount: Mapped[float] = mapped_column(nullable=False)
    description: Mapped[str]
    date: Mapped[datetime.date] = mapped_column(nullable=False)