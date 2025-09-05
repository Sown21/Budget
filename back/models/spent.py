from sqlalchemy import ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from typing import List, Optional
from core.database import Base
import datetime

class Category(Base):
    __tablename__ = "categories"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    parent_id: Mapped[Optional[int]] = mapped_column(ForeignKey("categories.id"))

    # Relations
    spents: Mapped[List["Spent"]] = relationship(back_populates="category")
    children: Mapped[List["Category"]] = relationship("Category", back_populates="parent")
    parent: Mapped[Optional["Category"]] = relationship("Category", remote_side=[id], back_populates="children")

class Spent(Base):
    __tablename__ = "spents"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    amount: Mapped[float] = mapped_column(nullable=False)
    description: Mapped[str]
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"))
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    date: Mapped[datetime.date] = mapped_column(nullable=False)

    # Relation
    category: Mapped[Category] = relationship(back_populates="spents")
    user: Mapped["User"] = relationship(back_populates="spents")