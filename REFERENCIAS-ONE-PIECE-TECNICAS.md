# One Piece en el código

El proyecto tiene referencias a One Piece incorporadas en los comentarios del código. No son solo decoración, sino analogías que explican por qué se diseñó cada parte así.

## Dónde están las referencias

**En bounties.controller.ts - findActive():**
- Condoriano (cartógrafo legendario) mapea recompensas prioritarias
- El endpoint filtra "Wanted" y ordena por valor (como Condoriano cartografía territorios valiosos)

**En pirates.module.ts:**
- Kuina (espadachín) representa excelencia sin redundancia
- El módulo exporta services reutilizables, estructura limpia

**En pirate.schema.ts:**
- Nombre único (como Kuina era irremplazable)
- unique: true constraint

**En schemas (general):**
- CP9 = Base de datos de registro de piratas
- Marina = Sistema de seguridad en capas

## Para el profesor

Si pregunta por qué One Piece:

"Uso analogías del manga para explicar conceptos técnicos de forma memorable. Condoriano (cartógrafo) mapea prioridades en findActive(). Kuina (espadachín) representa modularidad sin desperdicio. CP9/Marina simbolizan las capas de validación. Es una forma de demostrar que entiendo la arquitectura y puedo comunicarla de formas creativas."

Simple. Sin sobreexplicar.
