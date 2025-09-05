from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from typing import List
from core.database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)

    # Relations
    spents: Mapped[List["Spent"]] = relationship(back_populates="user", cascade="all, delete-orphan")