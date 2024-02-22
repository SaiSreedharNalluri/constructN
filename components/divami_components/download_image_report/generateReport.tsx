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
    fontSize: 10,
  },
  section1: {
    flex: 0.1,
    border: '1px solid black',
    padding: '5px',
    justifyContent:'space-between'
  },
  section2: {
    flex: 0.4,
    border: '1px solid black',
  },
  section3: {
    flex: 0.3,
    border: '1px solid black',
    flexDirection: 'row',
    backgroundColor:'#F3F3F3'
  },
  section4: {
    flex: 0.3,
    border: '1px solid black',
    flexDirection: 'column',
  },
  logo: {
    width: '50px',
    height: '50px',
    marginBottom: '5px',
  },
  title: {
    textAlign: 'left',
    marginBottom: '5px',
    fontSize:14
  },
  link: {
    textAlign: 'right',
    color:'rgba(255, 132, 63, 1)',
    marginBottom: '2px'
  },
  image: {
    width: '100%',
    height: '100%',
  },
  column: {
    flexDirection: 'column',
    width: '100%',
    padding: '5px',
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: '2px',
    backgroundColor:"rgba(109, 109, 109, 0.2)",
    fontSize:14,
    textAlign:'center'
  },
  heading1: {
    fontWeight: 'bold',
    marginBottom: '2px',
    marginLeft:"5px",
    backgroundColor:"rgba(109, 109, 109, 0.2)",
    fontSize:14,
  },
  keyValue: {
    marginBottom: '3px',
  },
});

interface IProps {
  project: IProjects,
  imageSrc: string,
  structure: IStructure
  snapshot: ISnapshot
  logedInUser:string,
  miniMapImg:string
}

const GenerateReport: React.FC<IProps> = ({ project, imageSrc, structure, snapshot,logedInUser,miniMapImg }) => {
  const formatAddress = (address:Address) => {
    return address.line1 +  ', ' + address.zipcode  +  ', ' + address.city + ', ' + address.state + ', ' + address.country;
  };
  return (
    <Document>
      <Page size="A4">
        <View style={styles.container}>
          <View style={styles.section1}>
            <Image style={styles.logo} src="https://constructn-attachments-dev.s3.ap-south-1.amazonaws.com/defaults/projectCoverPhoto.webp" />
            <View style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
            <Text style={styles.title}>Report for {structure.name} on {moment(snapshot.date).format('MMMM Do YYYY')}</Text>
            <Link style={styles.link} src="https://example.com">View this location in ConstructN </Link>
            </View>
          </View>
          <View style={styles.section2}>
            <Image style={styles.image} src={imageSrc} />
          </View>
          <View style={styles.section3}>
            <View style={styles.column}>
              <Text style={styles.heading}>Project Details</Text>
              <Text style={styles.keyValue}>Name: {project.name}</Text>
              <Text style={styles.keyValue}>Created:{moment(project.createdAt).format('MMMM Do YYYY')}</Text>
              <Text style={styles.keyValue}>Location: {project.address ? formatAddress(project.address) : '-'}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.heading}>Capture Details</Text>
              <Text style={styles.keyValue}> Capture Date: {moment(snapshot.date).format('MMMM Do YYYY')}</Text>
              <Text style={styles.keyValue}> Floor :{structure.name}</Text>
            </View>
            <View style={styles.column}>
            <Image style={styles.image} src={miniMapImg} />
            </View>
          </View>
          <View style={styles.section4}>
          <Text style={styles.heading1} >Notes</Text>
          <Text style={{bottom:0,position:'absolute',fontSize:14,textAlign:'center',marginBottom: '2px'}}>Exported by {logedInUser},{moment().format('MMMM Do YYYY, h:mm:ss a')} </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default GenerateReport;
