-- Habilitar extensión para búsqueda full-text en español
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Configuración de búsqueda en español
CREATE TEXT SEARCH CONFIGURATION IF NOT EXISTS spanish_unaccent (COPY = spanish);
ALTER TEXT SEARCH CONFIGURATION spanish_unaccent
  ALTER MAPPING FOR hword, hword_part, word WITH unaccent, spanish_stem;
