import React from 'react';
import { Document, Page, Text, StyleSheet, Image, View, Link } from '@react-pdf/renderer';
import { Address, IProjects } from '../../../models/IProjects';
import { IStructure } from '../../../models/IStructure';
import { ISnapshot } from '../../../models/ISnapshot';
import moment from 'moment';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    fontWeight:'medium',
    fontSize: 8,
  },
  section1: {
    flex: 0.1,
    border: '1px solid black',
    padding: '5px',
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    marginRight:'auto',
  },
  title: {
    marginBottom: '5px',
    fontSize: 12,
    textAlign: 'left',
    marginRight:'auto'
  },
  linkContainer: {
    marginLeft: 'auto',
  },
  link: {
    color: 'rgba(255, 132, 63, 1)',
    marginBottom: '2px',
    textAlign: 'right',
    marginLeft: 'auto'
  },
  section2: {
    flex: 0.5,
    border: '1px solid black',
  },
  section3: {
    flex: 0.2,
    border: '1px solid black',
    flexDirection: 'row',
    backgroundColor:'#F3F3F3'
  },
  section4: {
    flex: 0.2,
    border: '1px solid black',
    flexDirection: 'column',
  },
  logoContainer: {
    flex: 0.3,
  },
  logo: {
    width: '50px',
    height: '50px',
    marginBottom: '5px',
    flex:.1,
    position:'absolute',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heading1: {
    fontWeight: 'bold',
    marginBottom: '2px',
    fontSize:12,
    marginLeft:'10px',
    color:'#F3F3F3'
  },
  noteContainer:{
    backgroundColor:"rgba(109, 109, 109, 0.2)",
  },
  keyValue: {
    marginBottom: '3px',
  },
  column: {
    flexDirection: 'column',
    width: '100%',
    padding: '5px',
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: '2px',
    padding:'4px',
    backgroundColor: "rgba(109, 109, 109, 0.2)",
    fontSize: 10,
    textAlign: 'center',
    width: '100%',
  },
  keyValueContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  key: {
    width: '40%',
    fontWeight: 'bold',
  },
  value: {
    width: '60%',
  },
});

interface IProps {
  project: IProjects,
  imageSrc: string,
  structure: IStructure
  snapshot: ISnapshot
  logedInUser:string,
  miniMapImg:string,
}

const GenerateReport: React.FC<IProps> = ({ project, imageSrc, structure, snapshot,logedInUser,miniMapImg }) => {
  const formatAddress = (address: Address) => {
    const sanitizeValue = (value: string | undefined) => {
        return value !== undefined ? value : '';
    };
    return sanitizeValue(address.line1) + ', ' +
           sanitizeValue(address.zipcode) + ', ' +
           sanitizeValue(address.city) + ', ' +
           sanitizeValue(address.state) + ', ' +
           sanitizeValue(address.country);
};
  return (
    <Document>
      <Page size="A4">
        <View style={styles.container}>
        <View style={styles.section1}>
            <View style={styles.logoContainer}>
              <Image style={styles.logo} src="../../../public/divami_icons/logo-yellow.svg" />
            </View>
            <View style={{ flexDirection: 'row',alignItems: 'center', justifyContent: 'space-between',width:'100%'}}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Report for {structure.name} on {moment(snapshot.date).format('MMMM Do YYYY')}</Text>
            </View>
            <View style={styles.linkContainer}>
              <Link style={styles.link} src={window.location.href}>View this location in ConstructN </Link>
            </View>
            </View>
          </View>
        <View style={styles.section2}>
            <Image style={styles.image} src={imageSrc} />
          </View>
          <View style={styles.section3}>
          <View style={styles.column}>
              <Text style={styles.heading}>Project Details</Text>
              <View style={styles.keyValueContainer}>
                <Text style={styles.key}>Name:</Text>
                <Text style={styles.value}>{project.name}</Text>
              </View>
              <View style={styles.keyValueContainer}>
                <Text style={styles.key}>Created:</Text>
                <Text style={styles.value}>{moment(project.createdAt).format('MMMM Do YYYY')}</Text>
              </View>
              <View style={styles.keyValueContainer}>
                <Text style={styles.key}>Location:</Text>
                <Text style={styles.value}>{project.address ? formatAddress(project.address) : '-'}</Text>
              </View>
            </View>
            <View style={styles.column}>
              <Text style={styles.heading}>Capture Details</Text>
              <View style={styles.keyValueContainer}>
                <Text style={styles.key}>Capture Date:</Text>
                <Text style={styles.value}>{moment(snapshot.date).format('MMMM Do YYYY')}</Text>
              </View>
              <View style={styles.keyValueContainer}>
                <Text style={styles.key}>Floor:</Text>
                <Text style={styles.value}>{structure.name}</Text>
              </View>
            </View>
            <View style={styles.column}>
            <Image style={styles.image} src={miniMapImg} />
            </View>
          </View>
          <View style={styles.section4}>
            <View style={styles.noteContainer}>
            <Text style={styles.heading1}>Notes</Text>
            </View>
          <Text style={{bottom:0,position:'absolute',fontSize:12,textAlign:'center',marginBottom: '3px',marginLeft:'10px'}}>Exported by {logedInUser},{moment().format('MMMM Do YYYY, h:mm:ss a')} </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default GenerateReport;
