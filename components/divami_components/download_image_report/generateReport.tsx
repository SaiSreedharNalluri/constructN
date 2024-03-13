import React from 'react';
import { Document, Page, Text, StyleSheet, Image, View, Link } from '@react-pdf/renderer';
import { Address } from '../../../models/IProjects';
import moment from 'moment';
import { IReportData } from '../../../models/IReportDownload';

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
    flexDirection: 'column',
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
  logo: {
    width: 200,
    height: 200,
    objectFit:'contain',
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
  downloadReportData?:IReportData
}

const GenerateReport: React.FC<IProps> = ({ downloadReportData}) => {
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
            <View>
            <Image style={styles.logo} src="https://constructn-attachments-us.s3.us-west-2.amazonaws.com/defaults/Full-Yellow.png" />
            </View>
            <View style={{ flexDirection: 'row',alignItems: 'center', justifyContent: 'space-between',width:'100%',marginBottom:'15px'}}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Report for {downloadReportData?.structure?.name} on {moment(downloadReportData?.snapshot?.date).format('MMMM Do YYYY')}</Text>
            </View>
            <View style={styles.linkContainer}>
             {downloadReportData && <Link style={styles.link} src={`${window.location.href}&context=${encodeURIComponent(downloadReportData?.context)}`}>View this location in ConstructN </Link>}
            </View>
            </View>
          </View>
        <View style={styles.section2}>
            {downloadReportData&&<Image style={styles.image} src={downloadReportData.screenshot} />}
          </View>
          <View style={styles.section3}>
          <View style={styles.column}>
              <Text style={styles.heading}>Project Details</Text>
              <View style={styles.keyValueContainer}>
                <Text style={styles.key}>Name:</Text>
               { downloadReportData && <Text style={styles.value}>{downloadReportData?.project?.name}</Text>}
              </View>
              <View style={styles.keyValueContainer}>
                <Text style={styles.key}>Created:</Text>
                { downloadReportData && <Text style={styles.value}>{moment(downloadReportData?.project?.createdAt).format('MMMM Do YYYY')}</Text>}
              </View>
              <View style={styles.keyValueContainer}>
                <Text style={styles.key}>Location:</Text>
                { downloadReportData && <Text style={styles.value}>{downloadReportData?.project?.address ? formatAddress(downloadReportData.project.address) : '-'}</Text>}
              </View>
            </View>
            <View style={styles.column}>
              <Text style={styles.heading}>Capture Details</Text>
              <View style={styles.keyValueContainer}>
                <Text style={styles.key}>Capture Date:</Text>
                <Text style={styles.value}>{moment(downloadReportData?.snapshot?.date).format('MMMM Do YYYY')}</Text>
              </View>
              <View style={styles.keyValueContainer}>
                <Text style={styles.key}>Floor:</Text>
                <Text style={styles.value}>{downloadReportData?.structure?.name}</Text>
              </View>
            </View>
            <View style={styles.column}>
           {downloadReportData?.miniMapscreenshot ?<Image style={styles.image} src={downloadReportData.miniMapscreenshot}/>:(<></>)}
            </View>
          </View>
          <View style={styles.section4}>
            <View style={styles.noteContainer}>
            <Text style={styles.heading1}>Notes</Text>
            </View>
          <Text style={{bottom:0,position:'absolute',fontSize:12,textAlign:'center',marginBottom: '3px',marginLeft:'10px'}}>Exported by {downloadReportData?.logedInUser},{moment().format('MMMM Do YYYY, h:mm:ss a')} </Text>
          </View>
        </View>
      </Page>
   </Document>
  );
};

export default GenerateReport;
