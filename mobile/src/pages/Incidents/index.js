import React, { useState, useEffect} from 'react';
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { Feather } from '@expo/vector-icons';
import LogoImg from '../../assets/logo.png';
import styles from './styles';
import api from '../../services/api'

export default function Incidents(){
    const [incidents, setIncidents] = useState([]);
    const [total, setTotal]= useState(0);
    const [page, setPage] =  useState(1);
    const [loading, setloading] =  useState(false);


    const navigation = useNavigation();
    
    function navigationToDetail(incident){
        navigation.navigate('Detail', { incident })
    }

    async function loadIncidents(){
        if(loading){
            return;
        }

        if(total > 0 && incidents.length === total){
            return
        }
        setloading(true);

        const response = await api.get('incidents', {
            params: {page}
        });
        setIncidents([...incidents, ...response.data]);
        setTotal(response.headers['x-total-count']);
        setPage(page + 1);
        setloading(false);
    }

    useEffect(() => {
        loadIncidents();
    }, []);

    return(
        <View style={styles.container}>
            <View  style={styles.header}>
                <Image source = {LogoImg}/>
                <Text style={styles.headerText}>
                    Total de <Text style={styles.headerTextBold}> {total} casos</Text>
                </Text>
            </View>

            <Text style={styles.title}>Bem-vindo!</Text>
            <Text style={styles.description}>Escolha um dos casos abaixo e salve o dia.</Text>

            <FlatList
                data={incidents}
                style={styles.incidentsList}
                keyExtractor={incident => String(incident.id)}
                showsVerticalScrollIndicator={false}
                onEndReached={loadIncidents}
                onEndReachedThreshold={0.2}
                renderItem={({item: incident}) => (
                    <View style={styles.incidents}>
                        <Text style={styles.incidentsProperty}>ONG:</Text>
                        <Text style={styles.incidentsValor}>{incident.name}</Text>

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

                        <TouchableOpacity 
                            style={styles.detailsButton} 
                            onPress={() => navigationToDetail(incident)} 
                        >
                            <Text style={styles.detailsButtonText}>Ver mais detalhes</Text>
                            <Feather name="arrow-right" size={16} color="#E02041" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}