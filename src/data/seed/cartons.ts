import { carton, cartonPiece } from './helpers'

const C = 'Camion'
const V1 = 'Voiture 1'
const V2 = 'Voiture 2'

export const CARTONS_SEED = [
  // Salon-cuisine
  cartonPiece('Salon-cuisine', 'Cuisine', 'Vaisselle quotidienne', { priority: 'p1', data: { transport: C } }),
  cartonPiece('Salon-cuisine', 'Cuisine', 'Casseroles et poêles', { data: { transport: C } }),
  cartonPiece('Salon-cuisine', 'Cuisine', 'Vaisselle fragile', { priority: 'p1', data: { fragile: true, transport: C } }),
  cartonPiece('Salon-cuisine', 'Cuisine', 'Épices et condiments', { data: { transport: V2 } }),
  cartonPiece('Salon-cuisine', 'Cuisine', 'Ustensiles et tupperwares', { data: { transport: C } }),
  cartonPiece('Salon-cuisine', 'Salon', 'Livres et BD', { data: { transport: C } }),
  cartonPiece('Salon-cuisine', 'Salon', 'Jeux de société', { data: { transport: C } }),
  cartonPiece('Salon-cuisine', 'Salon', 'Déco et cadres', { data: { fragile: true, transport: C } }),
  carton('Télé / box / câbles', { priority: 'p1', data: { piece_actuelle: 'Salon-cuisine', piece_arrivee: 'Salon', contenu: 'Télé, box, câbles', a_demonter: true, fragile: true, transport: C } }),
  carton('Canapé / fauteuils', { data: { piece_actuelle: 'Salon-cuisine', piece_arrivee: 'Salon', transport: C } }),

  // Chambre parents
  cartonPiece('Chambre parents', 'Chambre parents', 'Vêtements été', { priority: 'p1' }),
  cartonPiece('Chambre parents', 'Chambre parents', 'Vêtements hors saison', { priority: 'p2' }),
  cartonPiece('Chambre parents', 'Chambre parents', 'Chaussures', { data: { transport: C } }),
  cartonPiece('Chambre parents', 'Chambre parents', 'Linge de lit rechange', { priority: 'p1' }),
  cartonPiece('Chambre parents', 'Chambre parents', 'Bijoux et accessoires', { priority: 'p1', data: { transport: V1 } }),
  cartonPiece('Chambre parents', 'Chambre parents', 'Livres et papiers', { data: { transport: V1 } }),
  carton('Lit parents', { priority: 'p1', data: { piece_actuelle: 'Chambre parents', piece_arrivee: 'Chambre parents', a_demonter: true, transport: C } }),
  carton('Armoire parents (contenu)', { data: { piece_actuelle: 'Chambre parents', piece_arrivee: 'Chambre parents', transport: C } }),

  // Chambre Julie
  cartonPiece('Chambre Julie', 'Chambre Julie', 'Vêtements', { priority: 'p1' }),
  cartonPiece('Chambre Julie', 'Chambre Julie', 'Jouets', { data: { transport: C } }),
  cartonPiece('Chambre Julie', 'Chambre Julie', 'Livres et jeux', { data: { transport: C } }),
  cartonPiece('Chambre Julie', 'Chambre Julie', 'Déco et affiches', { data: { transport: C } }),
  carton('Lit Julie', { priority: 'p1', data: { piece_actuelle: 'Chambre Julie', piece_arrivee: 'Chambre Julie', a_demonter: true, transport: C } }),
  carton('Bureau Julie', { data: { piece_actuelle: 'Chambre Julie', piece_arrivee: 'Chambre Julie', a_demonter: true, transport: C } }),

  // Chambre Elie
  cartonPiece('Chambre Elie', 'Chambre Elie', 'Vêtements', { priority: 'p1' }),
  cartonPiece('Chambre Elie', 'Chambre Elie', 'Jouets', { data: { transport: C } }),
  cartonPiece('Chambre Elie', 'Chambre Elie', 'Livres', { data: { transport: C } }),
  cartonPiece('Chambre Elie', 'Chambre Elie', 'Déco', { data: { transport: C } }),
  carton('Lit Elie', { priority: 'p1', data: { piece_actuelle: 'Chambre Elie', piece_arrivee: 'Chambre Elie', a_demonter: true, transport: C } }),

  // Chambre Raph
  cartonPiece('Chambre Raph', 'Chambre Raph', 'Vêtements', { priority: 'p1' }),
  cartonPiece('Chambre Raph', 'Chambre Raph', 'Jouets', { data: { transport: C } }),
  cartonPiece('Chambre Raph', 'Chambre Raph', 'Livres', { data: { transport: C } }),
  cartonPiece('Chambre Raph', 'Chambre Raph', 'Déco', { data: { transport: C } }),
  carton('Lit Raph', { priority: 'p1', data: { piece_actuelle: 'Chambre Raph', piece_arrivee: 'Chambre Raph', a_demonter: true, transport: C } }),

  // Salle de bain
  cartonPiece('Salle de bain', 'Salle de bain', 'Serviettes', { priority: 'p1', data: { transport: V2 } }),
  cartonPiece('Salle de bain', 'Salle de bain', 'Produits ouverts (bien fermés)', { priority: 'p1', data: { transport: V2 } }),
  cartonPiece('Salle de bain', 'Salle de bain', 'Pharmacie', { priority: 'p1', data: { transport: V1 } }),
  cartonPiece('Salle de bain', 'Salle de bain', 'Accessoires et déco', { data: { transport: C } }),

  // Buanderie
  cartonPiece('Buanderie', 'Buanderie', 'Produits ménagers', { priority: 'p1', data: { transport: V2 } }),
  carton('Machine à laver', { priority: 'p1', data: { piece_actuelle: 'Buanderie', piece_arrivee: 'Buanderie', transport: C } }),
  carton('Sèche-linge', { data: { piece_actuelle: 'Buanderie', piece_arrivee: 'Buanderie', transport: C } }),
  carton('Aspirateur / serpillière / balai', { priority: 'p1', data: { piece_actuelle: 'Buanderie', piece_arrivee: 'Buanderie', transport: V2 } }),

  // Dressing couloir
  cartonPiece('Dressing couloir', 'Dressing couloir', 'Vêtements famille été', { priority: 'p2' }),
  cartonPiece('Dressing couloir', 'Cave / stockage', 'Vêtements hors saison', { priority: 'p3' }),
  cartonPiece('Dressing couloir', 'Dressing couloir', 'Chaussures famille', { data: { transport: C } }),
  cartonPiece('Dressing couloir', 'Dressing couloir', 'Sacs et accessoires', { data: { transport: C } }),

  // Garage
  cartonPiece('Garage', 'Garage', 'Outils', { data: { transport: C } }),
  cartonPiece('Garage', 'Garage', 'Sport / EPS', { data: { transport: C } }),
  cartonPiece('Garage', 'Garage', 'Vélos (accessoires)', { data: { transport: C } }),
  cartonPiece('Garage', 'Garage', 'Pneus / équipement auto', { data: { transport: C } }),
  cartonPiece('Garage', 'Balcon / extérieur', 'Mobilier extérieur léger', { data: { transport: C } }),

  // Cave
  cartonPiece('Cave', 'Cave / stockage', 'Bouteilles — carton 1', { priority: 'p2', data: { fragile: true, transport: C } }),
  cartonPiece('Cave', 'Cave / stockage', 'Bouteilles — carton 2', { priority: 'p2', data: { fragile: true, transport: C } }),
  cartonPiece('Cave', 'Cave / stockage', 'Rangements et étagères', { priority: 'p3', data: { transport: C } }),
  cartonPiece('Cave', 'Cave / stockage', 'Conserves / stock alimentaire', { data: { transport: C } }),

  // Abri de jardin
  cartonPiece('Abri de jardin', 'Balcon / extérieur', 'Outils jardin', { data: { transport: C } }),
  cartonPiece('Abri de jardin', 'Balcon / extérieur', 'Mobilier jardin', { data: { transport: C } }),
  carton('Tondeuse / taille-haie', { data: { piece_actuelle: 'Abri de jardin', piece_arrivee: 'Balcon / extérieur', transport: C } }),

  // Transverses
  carton('Carton papiers importants', { priority: 'p1', data: { piece_actuelle: 'Salon-cuisine', piece_arrivee: 'Chambre parents', contenu: 'Papiers importants', transport: V1 } }),
  carton('Carton jour J — essentiel cuisine', { priority: 'p1', data: { piece_actuelle: 'Salon-cuisine', piece_arrivee: 'Cuisine', contenu: 'Essentiel jour J', transport: V2 } }),
]
