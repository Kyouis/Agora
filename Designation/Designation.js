import React, {useCallback, useEffect, useState} from 'react';
import {Picker, Text, TextInput, TouchableOpacity, View} from "react-native";
import * as SQLite from "expo-sqlite";
import {useFocusEffect} from "@react-navigation/native";
import Arbre from "../Localisation/Arbre";
import Styles from "../Styles";
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

//Ouverture de la bdd SQLite
const db = SQLite.openDatabase('Agora');

//fonction d'ajout d'élement dans la bdd
const addDesignation = (n, s, c, sc, d) => {
    db.transaction((tx) => {
        let idp;
        tx.executeSql("SELECT * FROM CURRENTID ", [], (tx, rs) => {
            idp=rs.rows.item(0).currentCompId;
            tx.executeSql("INSERT INTO ELEMENT (nom, strate, classe, sousClasse, denom, idComp) VALUES (?,?,?,?,?,?)", [n, s, c, sc, d, idp],
                (tx, rs) => {}, (tx, e) => console.log(e));
        })
    })
}

//Screen correspondant à la désignation d'élement
const Designation = ({navigation}) => {

    //classes
    const consEnt = ['Construction légère', 'Construction modulaire', 'Construction tendue', 'Construction gonflable', 'Construction de loisir et mobile', 'Construction événementielle'];
    const consEnv = ['Composant acoustique', 'Couverture', 'Isolation', 'Membrane', 'Obstruction des baies', 'Occultation et protection solaire des baies', 'Revetement'];
    const consObj = ['Consommables', 'Décorations', 'Électroménagers', 'Électroniques', 'Génies climatiques', 'Huisseries', 'Menuiseries', 'Luminaires', 'Mobiliers', 'Mobilités', 'Quincailleries', 'Sanitaires', 'Textiles', 'Végétaux'];
    const consReseau = ['Air / Fumées', 'Combustibles solides', 'Communications', 'Eaux', 'Électricité', 'Évacuation des ordures', 'Froid / Chaud / Mixte', 'Gaz / Fioul', 'Incendie'];
    const consStructure = ['Charpentes', 'Coques', 'Non porteurs', 'Porteurs horizontaux', 'Porteurs verticaux', 'Structures tendues', 'Contreventement'];

    //Sous-classes
    const consLeg = ['Portique', 'Véranda', 'Serre/Solarium', 'Appentis', 'Auvent', 'Marquise', 'Abribus', 'Pergola', 'Chalet (kit)', 'Poulailler', 'Niches', 'Garage', 'Abri', 'Cabane'];
    const consMod = ['Grille bidimensionnelle', 'Structure spatiale tridimensionnelle/Grille tridimensionnelle', 'Dome de Schwedler', 'Dome géodésique', 'Dome-cable', 'Dome', 'Module de bureau (type Algeco)', 'Module de chantier (type Algeco)', 'Module scolaire (type Algeco)', 'Module sanitaire (type Algeco)', 'Module santé (type Algeco)', 'Module évenementiel (type Algeco)'];
    const consTendu = [];
    const consEven = ['Chapiteau', 'Chapiteau (cirque)', 'Barnum', 'Tente', 'Gradin'];
    const consGonf = ['Structure gonflable/Structure pneumatique', 'Chateau gonflable'];
    const consLois = ['Aire de jeux', 'Multisports (City-Stade)', 'Dispositif sportif collectif', 'Dispositif sportif individuel', 'HLL'];
    const consAcou = ['Panneau Reverberant', 'Panneau perforé', 'Revetement absorbant', 'Capitonnage', 'Plénum', 'Baffe/Piège à son', 'Résonateur', 'Diffuseur', 'Masque', 'Ecran', 'Paroi Composite', 'Matelas amortisseur', 'Couche résiliente', 'Sous-couche résiliente', 'Semelle résiliante'];
    const consCouv = ['Composant de couverture', 'Bac à double peau/ Bac à double paroi', 'Bache', 'Bac', 'Caisson chevronné', 'Feuille à joint debout', 'Fendis', 'Feuille métallique/Bande métallique', 'Lauzes/Lauses', 'Lé/Laize', 'Nappes', 'Plaque ondulée support de tuiles', 'Plaque alvéolaire', 'Plaques', 'Shingles', 'Tavaillons', 'Tole nervurée/Plaque nervurée', 'Tole ondulée/Plaque ondulée', 'Tole', 'Tuile', 'Voile'];
    const consMemb = ['Pare-pluie', 'Pare-vapeur', 'Bande d\'arret d\'eau', 'Géomembrane', 'Géotextile', 'Coupure de capilarité', 'Coupure d\'étanchéité', 'Écran de sous-toiture', 'Étanchéité autoprotégée', 'Étanchéité à protection lourde', 'Étanchéité à fixation indépendante', 'Étanchéité semi-indépendante', 'Étanchéité adhérante', 'Revetement d\'étanchéité multicouche', 'Revetement d\'étanchéité monocouche'];
    const consIso = ['Isolants rigides', 'Isolants semi-rigides', 'Isolants souples', 'Vracs', 'Film thermoréflectif (isolant mince)'];
    const consObstru = ['Grilles', 'Barreaudages', 'Moustiquaires', 'Grilles à enroulement', 'Rideaux mécanique'];
    const consOccul = ['Volets', 'Store vénitien', 'Persiennes', 'Jalousies', 'Stores', 'Bannes', 'Composants des occultations et protections solaire des baies'];
    const consRevet = ['Bardages', 'Boiseries', 'Brique de parement', 'Cassette', 'Coulés', 'Dallages', 'Enduits', 'Faux-plafonds', 'Faux-planchers', 'Frisettes', 'Lambris', 'Lé / Laize', 'Mailles', 'Panneaux', 'Parements', 'Parquets', 'Pavages', 'Revêtements souples', 'Revêtements textiles', 'Tapisseries', 'Toiles', 'Vêtage', 'Vêture', 'Moulure'];
    const consSani = ['Baignoire', 'Composants sanitaires', 'Bidet', 'Cabine de douche', 'Cuvette', 'Évier à bandeau', 'Évier à encastrer', 'Fontaine', 'Lavabo', 'Lavabo sur colonne', 'Lavabo suspendu / Lavabo en applique', 'Lave-mains', 'Pare-douche', 'Receveur de douche / Bac à douche', 'Bains à remouds (Spa / Jacuzzi)', 'Stalle', 'Timbre d\'office / Bac à laver', 'Toilettes', 'Urinoir', 'Vasque', 'Vidoir'];
    const consDeco = ['Tableau', 'Vase', 'Sculpture', 'Cadre', 'Panier'];
    const consMobilier = ['Système de rangement', 'Banc TV', 'Bureaux', 'Module', 'Meuble TV', 'Range bouteille', 'Penderie', 'Dressing', 'Bibliothèque', 'Desserte', 'Établi', 'Buffet', 'Console', 'Armoire', 'Commode', 'Urbain', 'Étagère', 'Tables', 'Assises', 'Miroiterie', 'Literie'];
    const consMobilite = ['Vélos', 'Motos', 'Voitures', 'Camions', 'Bus', 'Cars', 'Tracteurs', 'Remorques', 'Scooters', 'Skates', 'Rollers', 'Trotinettes'];
    const consLumi = ['Applique', 'Borne lumineuse', 'Candélabre', 'Composants des luminaires', 'Hublot', 'Lampadaire', 'Lampe de table', 'Lampes', 'Lustre', 'Plafonnier', 'Projecteur', 'Rampe', 'Spot', 'Suspension'];
    const consMenui = ['Placard', 'Bibliothèque', 'Étagère', 'Claustra'];
    const consHuiss = ['Baies fixes', 'Baies vitrées', 'Composants de mouvement et de comdamnation des portes ', 'Composants structurels des huisseries', 'Fenêtres', 'Portail', 'Portes', 'Portes-fenêtres', 'Passe-plat', 'Vitrine', 'Guichet'];
    const consTextile = ['Linge de maison', 'Vêtements', 'Tapis', 'Rideaux'];
    const consElectronique = ['Amplificateurs', 'Appareils photographiques', 'Caméras', 'Chaines HI-FI', 'Écrans d\'ordinateurs', 'Enceintes', 'Ordinateurs fixes', 'Ordinateurs portables', 'Téléphones fixes', 'Télévisions', 'Consoles de jeux'];
    const consElectromenager = ['Congélateurs', 'Cuisinières', 'Hottes', 'Lave vaiselle', 'Machines à laver', 'Plaques de cuisson', 'Réfrégirateurs', 'Mixeurs', 'Sèches linges', 'Robots de cuisines', 'Centrifugeuses', 'Fours', 'Laves linges', 'Cafetières', 'Bouilloires', 'Caves à vins'];
    const consConso = ['Nourritures', 'Boissons', 'Hygiènes ménagers', 'Hygiènes corporels'];
    const quincail = ['Équerre', 'Connecteur'];
    const vegetaux = ['Arbres', 'Arbustes', 'Plantes', 'Fleurs'];
    const consAir = ['Air/fumées composants', 'Air/fumées évacuation'];
    const consCombus = ['Combustibles solides composants', 'Combustibles solides appareils'];
    const consComm = ['Communications câbles', 'Communications composants'];
    const consEau = ['Composants E.P.', 'Composants E.U.', 'Composants E.V.', 'Eaux appareils', 'Eaux conduits', 'Eaux épuration', 'Robinetterie'];
    const consOrdure = ['Vide-ordures', 'Conduit de chute', 'Ventilation', 'Hérisson', 'Culotte', 'Vidoir', 'Pelle / Godet', 'Obtrurateur', 'Silo', 'Trappe', 'Logette', 'Bac roulant', 'Corbeille', 'Poubelle'];
    const consElectricite = ['Électricité câbles', 'Électricité conduits', 'Électricités composants', 'Poste de livraison', 'Protections contre la foudre'];
    const consFCM = ['Composants conditionnement d\'air', 'Composants corps de chauffe', 'Composants solaires', 'Corps de chauffe'];
    const consGaz = ['Gaz/fioul conduits', 'Gaz/fioul composants', 'Gaz/fioul appareils'];
    const consIncendie = ['Composants incendies', 'Systèmes'];
    const consContrevet = ['Arc-boutant', 'Butée', 'Culée', 'Raidisseur', 'Contrefort', 'Lésène', 'Poutre-au-vent', 'Palée', 'Palée en croix de Saint-André', 'Palée en K', 'Aisselier', 'Écharpe', 'Tirant', 'Bielle', 'Hauban', 'Ancrage', 'Tendeur', 'Ancre'];
    const consCharpente = ['Charpentes industrielles', 'Charpentes traditionnelles', 'Composants de charpente', 'Demi-fermes', 'Fermes'];
    const consCoque = ['Voile mince', 'Coque à simple courbure', 'Coque à double courbure de même sens', 'Coque mince à double courbure inverse / Voile mince à double courbure inverse / Coque en selle de cheval', 'Coque mince en paraboloïde-hyperbolique / Voile mince en paraboloïde-hyperbolique / Coque PH', 'Coque mince en conoïde / Voile mince en conoïde', 'Double coque', 'Diaphragme', 'Berceau', 'Tympan / Closoir'];
    const consNonPorteur = ['Composants baies', 'Dispositifs anti-chutes', 'Dispositifs ascentionnels', 'Dispositifs de cloisonements extérieur', 'Escaliers', 'Batardeau', 'Palplanche', 'Boisage / Blindage', 'Étrésillon', 'Buton / Button / Grand étrésillon', 'Étai'];
    const consPorteurHorizontaux = ['Composants de planchers', 'Composants des arcs et des voûtes', 'Dalles', 'Linteau', 'Planchers', 'Poutres', 'Semelle filante', 'Semelle ponctuelle', 'Tablier', 'Tirant d\'ancrage / Barre d\'ancrage'];
    const consPorteurVerticaux = ['Bloc préfabriqué', 'Cloisons', 'Composants colonnes', 'Composants de la façade', 'Composants de mur', 'Composants de cloison', 'Écaille', 'Façades', 'Gabion', 'Murs', 'Panneau lourd', 'Porteurs verticaux ponctuels'];
    const consStructureTendue = ['Composants de structure tendue', 'Structure en roue de bicyclette', 'Structure gonflable à basse pression / Structure gonflable à simple enveloppe', 'Structure gonflable à haute pression / Structure gonflable à double enveloppe', 'Structure tendue en membrane textile', 'Structure tendue en résille de câbles', 'Struxture tendue métallo-textile'];

    //states utilisés
    const [elem, setElem] = useState([]);
    const [nom, setNom] = useState();
    const [strate, setStrate] = useState();
    const [classe, setClasse] = useState();
    const [sc, setSc] = useState();
    const [denom, setDenom] = useState();
    const [classeList, setCL] = useState(consEnt);
    const [scList, setSCL] = useState([]);
    const [denomList, setDL] = useState([]);



    //fonction gérant les menus déroulant liés
    const changeClasse = (s) => {
        let res = classeList;
        switch(s) {
            case 'Construction entière':
                res=consEnt;
                break;
            case 'Enveloppe':
                res=consEnv;
                break;
            case 'Objet':
                res=consObj;
                break;
            case 'Reseau':
                res=consReseau;
                break;
            case 'Structure':
                res=consStructure;
                break
        }
        setCL(res);
    };

    //fonction gérant les menus déroulants liés
    const changeSC = (c) => {
      let res = scList;
      switch (c) {
          case 'Construction légère':
              res=consLeg;
              break;
          case 'Construction modulaire':
              res=consMod;
              break;
          case 'Construction tendue':
              res=consTendu;
              break;
          case 'Construction événementielle':
              res=consEven;
              break;
          case 'Construction gonflable':
              res=consGonf;
              break;
          case 'Construction de loisir et mobile':
              res=consLois;
              break;
          case 'Composant acoustique':
              res=consAcou;
              break;
          case 'Couverture':
              res=consCouv;
              break;
          case 'Membrane':
              res=consMemb;
              break;
          case 'Isolation':
              res=consIso;
              break;
          case 'Obstruction des baies':
              res=consObstru;
              break;
          case 'Occultation et protection solaire des baies':
              res=consOccul;
              break;
          case 'Revetement':
              res=consRevet;
              break;
          case 'Sanitaires':
              res=consSani;
              break;
          case 'Décorations':
              res=consDeco;
              break;
          case 'Mobiliers':
              res=consMobilier;
              break;
          case 'Mobilités':
              res=consMobilite;
              break;
          case 'Luminaires':
              res=consLumi;
              break;
          case 'Menuiseries':
              res=consMenui;
              break;
          case 'Huisseries':
              res=consHuiss;
              break;
          case 'Textiles':
              res=consTextile;
              break;
          case 'Électroniques':
              res=consElectronique;
              break;
          case 'Électroménagers':
              res=consElectromenager;
              break;
          case 'Consommables':
              res=consConso;
              break;
          case 'Quincailleries':
              res=quincail;
              break;
          case 'Végétaux':
              res=vegetaux;
              break;
          case 'Air / Fumées':
              res=consAir;
              break;
          case 'Combustibles solides':
              res=consCombus;
              break;
          case 'Communications':
              res=consComm;
              break;
          case 'Eaux':
              res=consEau;
              break;
          case 'Évacuation des ordures':
              res=consOrdure;
              break;
          case 'Électricité':
              res=consElectricite;
              break;
          case 'Froid / Chaud / Mixte':
              res=consFCM;
              break;
          case 'Gaz / Fioul':
              res=consGaz;
              break;
          case 'Incendie':
              res=consIncendie;
              break;
          case 'Charpentes':
              res=consCharpente;
              break;
          case 'Coques':
              res=consCoque;
              break;
          case 'Non porteurs':
              res=consNonPorteur;
              break;
          case 'Porteurs horizontaux':
              res=consPorteurHorizontaux;
              break;
          case 'Porteurs verticaux':
              res=consPorteurVerticaux;
              break;
          case 'Structures tendues':
              res=consStructureTendue;
              break;
          case 'Contreventement':
              res=consContrevet;
              break;

      }
      setSCL(res);
    };

    //fonction permettant d'afficher les éléments correspondant au compartiment sélectionné
    const selectElem = (comp) => {
        db.transaction( (tx) => {
            tx.executeSql("SELECT * FROM ELEMENT WHERE idCOmp = ?", [comp], (tx, rs) => {
                let res = [];
                for (let i = 0; i<rs.rows.length; i++) {
                    res.push(rs.rows.item(i));
                }
                setElem(res);
            })
        }, (e) => console.log(e));
    };

    //Actualisation
    useFocusEffect(() => {
        db.transaction((tx) => {
            let idp;
            tx.executeSql("SELECT * FROM CURRENTID ", [], (tx, rs) => {
                idp=rs.rows.item(0).currentCompId;
                selectElem(idp);
            })
        })

    });
    //render les menus déroulants
    return (
        <>
            <View style={{flexDirection: "row", flex:1, width: '100%', height: '100%'}}>
                <Arbre num='6'/>
                <View style={{flex: 2}}>
                    <View style={{backgroundColor: 'gray', flex:1, flexDirection: "row"}}>
                        <Text style={{paddingHorizontal: '6%', fontSize: 20}}>Élement</Text>
                        <Text style={{paddingHorizontal: '5%', fontSize: 20}}>Strates</Text>
                        <Text style={{paddingHorizontal: '5%', fontSize: 20}}>Classe</Text>
                        <Text style={{paddingHorizontal: '5%', fontSize: 20}}>Sous-Classe</Text>
                        <Text style={{paddingHorizontal: '5%', fontSize: 20}}>Denomination</Text>
                    </View>
                    <View style={{backgroundColor: 'gray', flex:10, flexDirection: "column"}}>
                        {
                            elem.map(value => {
                                return(
                                    <View key={value.idElem} style={{flexDirection: "row"}}>
                                        <TextInput
                                            style={Styles.designPicker}
                                            onChangeText={(n) => {}}
                                            value={value.nom}
                                            placeholder="Nom de l'élément"
                                        />
                                        <Picker
                                            style={Styles.designPicker}
                                            selectedValue={value.strate}
                                            onValueChange={(itemValue, itemIndex) =>{}}
                                        >
                                            <Picker.Item label='Construction entière' value='Construction entière'/>
                                            <Picker.Item label='Enveloppe' value='Enveloppe'/>
                                            <Picker.Item label='Objet' value='Objet'/>
                                            <Picker.Item label='Réseau' value='Reseau'/>
                                            <Picker.Item label='Structure' value='Structure'/>
                                        </Picker>
                                        <Picker
                                            style={Styles.designPicker}
                                            selectedValue={value.classe}
                                            onValueChange={(itemValue, itemIndex) => {}}
                                        >
                                            {
                                                classeList.map((item, index) => {
                                                    return (<Picker.Item label={item} value={item} key={index}/>)
                                                })
                                            }
                                        </Picker>
                                        <Picker
                                            style={Styles.designPicker}
                                            selectedValue={value.sousClasse}
                                            onValueChange={(itemValue, itemIndex) => {}}
                                        >
                                            {
                                                scList.map((item, index) => {
                                                    return (<Picker.Item label={item} value={item} key={index}/>)
                                                })
                                            }
                                        </Picker>
                                        <Picker
                                            style={Styles.designPicker}
                                            selectedValue={value.denom}
                                            onValueChange={(itemValue, itemIndex) => {}}
                                        >
                                            <Picker.Item label='test' value='test'/>
                                        </Picker>
                                        <TouchableOpacity
                                            onPress={() => {addDesignation(nom, strate, classe, sc, denom); setNom('')}}
                                        >
                                            <AntDesign name="pluscircle" size={24} color="black"/>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })
                        }

                        <View style={{flexDirection: "row"}}>
                            <TextInput
                                style={Styles.designPicker}
                                onChangeText={(n) => {setNom(n)}}
                                value={nom}
                                placeholder="Nom de l'élément"
                            />
                            <Picker
                                style={Styles.designPicker}
                                selectedValue={strate}
                                onValueChange={(itemValue, itemIndex) =>{
                                    setStrate(itemValue);
                                    changeClasse(itemValue);
                                }}
                            >
                                <Picker.Item label='Construction entière' value='Construction entière'/>
                                <Picker.Item label='Enveloppe' value='Enveloppe'/>
                                <Picker.Item label='Objet' value='Objet'/>
                                <Picker.Item label='Réseau' value='Reseau'/>
                                <Picker.Item label='Structure' value='Structure'/>
                            </Picker>
                            <Picker
                                style={Styles.designPicker}
                                selectedValue={classe}
                                onValueChange={(itemValue, itemIndex) => {
                                    setClasse(itemValue);
                                    changeSC(itemValue)
                                    }}
                            >
                                {
                                    classeList.map((item, index) => {
                                        return (<Picker.Item label={item} value={item} key={index}/>)
                                    })
                                }
                            </Picker>
                            <Picker
                                style={Styles.designPicker}
                                selectedValue={sc}
                                onValueChange={(itemValue, itemIndex) => {setSc(itemValue)}}
                            >
                                {
                                    scList.map((item, index) => {
                                        return (<Picker.Item label={item} value={item} key={index}/>)
                                    })
                                }
                            </Picker>
                            <Picker
                                style={Styles.designPicker}
                                selectedValue={denom}
                                onValueChange={(itemValue, itemIndex) => {setDenom(itemValue)}}
                            >
                                <Picker.Item label='test' value='test'/>
                            </Picker>
                            <TouchableOpacity
                                onPress={() => {addDesignation(nom, strate, classe, sc, denom); setNom('');}}
                            >
                                <AntDesign name="pluscircle" size={24} color="black"/>
                            </TouchableOpacity>
                        </View>

                    </View>
                </View>

            </View>
        </>
    );
}

export default Designation;