from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from typing import List
from core.database import Base
from models.spent import Spents

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True, nullable=False)

    # Relations
    spents: Mapped[List["Spents"]] = relationship(back_populates="user", cascade="all, delete-orphan")