from fastapi import APIRouter, HTTPException
from typing import Dict, Any
import os
import glob

router = APIRouter(prefix="/analyse", tags=["analyse"]) 


@router.get("/", response_model=Dict[str, Any])
async def get_analyse():
    """
    Lit le dernier fichier .md qui contient 'analyse' dans le nom
    depuis le répertoire app/data/ et retourne son contenu
    """
    try:
        # Chemin vers le dossier data
        data_dir = os.path.join(os.path.dirname(__file__), "..", "data")
        
        # Vérifier si le dossier existe
        if not os.path.exists(data_dir):
            raise HTTPException(status_code=404, detail=f"Dossier data non trouvé: {data_dir}")
        
        # Rechercher tous les fichiers .md contenant "analyse" dans le nom
        pattern = os.path.join(data_dir, "*analyse*.md")
        files = glob.glob(pattern)
        
        if not files:
            raise HTTPException(status_code=404, detail="Aucun fichier d'analyse trouvé")
        
        # Trier par date de modification (le plus récent en premier)
        latest_file = max(files, key=os.path.getmtime)
        
        # Lire le contenu du fichier
        with open(latest_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extraire le nom du fichier
        filename = os.path.basename(latest_file)
        
        return {
            "filename": filename,
            "content": content,
            "path": latest_file
        }
    
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=f"Fichier d'analyse non trouvé: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la lecture du fichier: {str(e)}")

