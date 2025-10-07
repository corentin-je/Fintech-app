from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
import pandas as pd
import os

router = APIRouter(prefix="/opportunites", tags=["opportunites"]) 


@router.get("/", response_model=List[Dict[str, Any]])
async def get_opportunites():
    """
    Lit le fichier parquet des opportunités et retourne les données
    """
    try:
        # Chemin vers le fichier parquet
        file_path = os.path.join(os.path.dirname(__file__), "..", "services", "opportunites_20251007_101504.parquet")
        
        # Vérifier si le fichier existe
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"Fichier opportunités non trouvé: {file_path}")
        
        # Lire le fichier parquet
        df = pd.read_parquet(file_path)
        
        # Convertir en liste de dictionnaires
        opportunites = df.to_dict(orient='records')
        
        return opportunites
    
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=f"Fichier opportunités non trouvé: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la lecture du fichier: {str(e)}")

