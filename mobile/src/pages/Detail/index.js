import React from 'react';
import { View, Image, Text, TouchableOpacity, Linking} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons';
import LogoImg from '../../assets/logo.png';
import styles from './styles';
import * as MailComposer from 'expo-mail-composer';

export default function Detail(){
    const navigation = useNavigation();
    const route = useRoute();

    const incident = route.params.incident;

    const message = `Olá ${incident.name}, estou entrando em contato pois gostaria de ajudar no caso "${incident.title}" com valor de ${Intl.NumberFormat('pt-BR',{ 
        style : 'currency', 
        currency: 'BRL'
        }).format(incident.value)
    }` ;

    function navigationToIncidents(){
        navigation.navigate('Incidents')
    }

    /*function navigateBack() {
        navigation.goBack()
    }*/



    function sendMail(){
        MailComposer.composeAsync({
            subject: `Herói do caso: ${incident.title}`,
            recipients: [incident.email],
            body: message,
        });
    }

    function sendWhatsapp(){
        Linking.canOpenURL(`whatsapp://send?text=${message}&phone=${incident.whatsapp}`)
        .then(supported =>{
                if(supported){
                    return Linking.openURL(
                        `whatsapp://send?text=${message}&phone=${incident.whatsapp}`
                    );
                }else{
                    return Linking.openURL(
                        `https://api.whatsapp.com/send?text=${message}&phone=${incident.whatsapp}`
                    );
                }
            }
        )
    }

    return(
        <View style={styles.container}>
            <View  style={styles.header}>
                <Image source = {LogoImg}/>
                <TouchableOpacity  onPress={navigationToIncidents}>
                    <Feather name="arrow-left" size={24} color="#E02041"  />
                </TouchableOpacity>
            </View>

            <View style={styles.incidents}>
                <Text style={styles.incidentsProperty}>ONG:</Text>
    <Text style={styles.incidentsValor}>{incident.name} de {incident.city}/{incident.uf}</Text>

                <Text style={styles.incidentsProperty}>CASO:</Text>
                <Text style={styles.incidentsValor}>{incident.case}</Text>

                <Text style={styles.incidentsProperty}>VALOR:</Text>
                <Text style={styles.incidentsValor}>
                    {Intl.NumberFormat('pt-BR',{ 
                        style : 'currency', 
                        currency: 'BRL'
                        }).format(incident.value)
                    }
                </Text>
            </View>

            <View style={styles.contactBox}>
                <Text style={styles.heroTitle}>Salve o dia!</Text>
                <Text style={styles.heroTitle}>Seja o herói desse caso.</Text>

                <Text style={styles.heroDescription}>Entre em contato:</Text>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.action} onPress={sendWhatsapp}>
                        <Text style={styles.actionText}>Whatsapp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.action} onPress ={sendMail}>
                        <Text style={styles.actionText}>E-mail</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}
