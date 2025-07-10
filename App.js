import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { VLB_MOBILE_SECRET, ENDPOINT_URL } from '@env';

const ChartScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const screenWidth = Dimensions.get('window').width;
  const isTablet = screenWidth >= 768;

  useEffect(() => {
    const loadData = async () => {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        setData({ error: 'No internet connection. Please check your network.' });
        setLoading(false);
        return;
      }

       // 🪵 Debug: Check values
    console.log('Auth Header:', VLB_MOBILE_SECRET);
    console.log('Endpoint:', ENDPOINT_URL);

      try {
        const response = await fetch(ENDPOINT_URL, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-vlb-mobile-auth': VLB_MOBILE_SECRET,
          },
        });

        if (!response.ok) {
          if (response.status === 403) throw new Error('unauthorized');
          else throw new Error('server');
        }

        const json = await response.json();
        setData(json);
      } catch (error) {
        if (error.message === 'unauthorized') {
          setData({ error: 'Unauthorized access. Invalid app credentials.' });
        } else if (error.message === 'server') {
          setData({ error: 'Server error. Unable to load chart data.' });
        } else {
          setData({ error: 'Unexpected error. Please try again later.' });
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const renderTable = (dataset, title) => (
    <View style={styles.tableWrapper}>
      <Text style={styles.tableTitle}>{title}</Text>
      <View style={styles.tableHeader}>
        {[
          'No', 'Counterpart', 'Bonanza', 'Malta', 'String Key',
          'Shadow', 'Partner', 'Enquivalent', 'Code', 'Turning',
        ].map((heading, idx) => (
          <Text key={idx} style={styles.headerCell}>{heading}</Text>
        ))}
      </View>

      {dataset.map((item, idx) => (
        <View key={item.number} style={[styles.tableRow, styles.altRow]}>
          <Text style={styles.numCell}>{item.number}</Text>
          <Text style={styles.cell}>{item.counterpart}</Text>
          <Text style={styles.cell}>{item.bonanza}</Text>
          <Text style={styles.cell}>{item.malta}</Text>
          <Text style={styles.cell}>{item.stringKey}</Text>
          <Text style={styles.cell}>{item.shadow}</Text>
          <Text style={styles.cell}>{item.partner}</Text>
          <Text style={styles.cell}>{item.enquivalent}</Text>
          <Text style={styles.cell}>{item.code}</Text>
          <Text style={styles.cell}>{item.turning}</Text>
        </View>
      ))}
    </View>
  );

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#3498db" />;
  if (data?.error) return (
    <View style={styles.errorWrapper}>
      <Text style={styles.errorText}>{data.error}</Text>;
    </View>
  ); 

  return (
    <SafeAreaView style={styles.safeWrapper}>
      <ImageBackground
        source={require("./assets/Lotto_shot.webp")}
        style={styles.background}
        resizeMode='cover'
      >
        <ScrollView contentContainerStyle={[styles.container, { flexDirection: isTablet ? 'row' : 'column' }]}>
          {renderTable(data.one_to_fortyfive)}
          {renderTable(data.fortysix_to_ninety)}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeWrapper: {
    flex: 1,
    backgroundColor: '#000', // fallback in case image doesn’t load
},
  background: {
    flex: 1,
    width: '100%',
    height: '100%', 
  },
  container: {
    justifyContent: 'center',
    // padding: 12,
    gap: 20,
    paddingBottom: 100,
    paddingTop: 100
  },
  tableWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    overflow: 'hidden',
    // backgroundColor: '#fff',
  },
  tableTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    // fontSize: 16,
    // paddingVertical: 8,
    // backgroundColor: '#f0f0f0',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ff0000',
    // position: "absolute",
    // top: 0,
    zIndex: 10,
    paddingVertical: 6,
    width: '100%',
    // paddingVertical: 4,
    borderBottomWidth: 1,
    // borderColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    color: '#fff',
    padding: 5,
    textAlign: 'center',
    // transform: [{ rotate: '-180deg' }],
    writingDirection: 'ltr', // approximate vertical feel
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  altRow: {
    backgroundColor: '#ffff00',
    margin: 1,
  },
  numCell: {
    flex: 1,
    backgroundColor: '#800080',
    color: 'white',
    textAlign: 'center',
    fontWeight: '400',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 15,
    color: '#444',
        margin: 2,

  },
  errorWrapper: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  paddingHorizontal: 20,
},
errorText: {
  color: 'red',
  textAlign: 'center',
  fontSize: 14,
},
});

export default ChartScreen;
