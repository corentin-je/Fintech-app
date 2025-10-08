from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import pandas as pd
import os
import glob

router = APIRouter(prefix="/portfolio", tags=["portfolio"]) 


@router.get("/", response_model=List[Dict[str, Any]])
async def get_portfolio():
    """
    Lit le fichier parquet du portfolio le plus récent et retourne les données
    """
    try:
        # Chemin vers le répertoire data
        data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
        
        # Vérifier si le répertoire existe
        if not os.path.exists(data_dir):
            raise HTTPException(status_code=404, detail=f"Répertoire data non trouvé: {data_dir}")
        
        # Chercher tous les fichiers parquet contenant "portfolio"
        pattern = os.path.join(data_dir, "*portfolio*.parquet")
        portfolio_files = glob.glob(pattern)
        
        if not portfolio_files:
            raise HTTPException(status_code=404, detail="Aucun fichier portfolio trouvé")
        
        # Trier par date de modification (le plus récent en premier)
        portfolio_files.sort(key=os.path.getmtime, reverse=True)
        file_path = portfolio_files[0]
        
        # Lire le fichier parquet
        df = pd.read_parquet(file_path)
        
        # Convertir en liste de dictionnaires
        portfolio = df.to_dict(orient='records')
        
        return portfolio
    
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=f"Fichier portfolio non trouvé: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la lecture du fichier: {str(e)}")

