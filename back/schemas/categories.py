from pydantic import BaseModel

class CategoryCreate(BaseModel):
    name: str
    parent_id: int = None

class SubCategoryCreate(BaseModel):
    name: str
    parent_id: int

class CategoryUpdate(BaseModel):
    name: str
    parent_id: int = None