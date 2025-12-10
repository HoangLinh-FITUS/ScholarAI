from dataclasses import dataclass

@dataclass
class SignIn: 
    email: str 
    password: str 
    role: str
    full_name: str 
    phone: str 

@dataclass
class Login: 
    email: str 
    password: str  

