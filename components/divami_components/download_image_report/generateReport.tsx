import React from 'react';
import { Document, Page, Text, StyleSheet, Image, View, Link } from '@react-pdf/renderer';
import { Address } from '../../../models/IProjects';
import moment from 'moment';
import { IReportData } from '../../../models/IReportDownload';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: '95%',
    height: '98%',
    fontWeight:'medium',
    fontSize: 8,
    marginTop:'2px',
    marginLeft:'13px',
  },
  section1: {
    flex: 0.1,
    flexDirection: 'row',alignItems: 'center', justifyContent: 'space-between',width:'100%',
    maxHeight:'50px'
  },
  titleContainer: {
    backgroundColor:'#f1742e',
    height:'60px',
    flexDirection: 'row',
    paddingTop:'15px',
    paddingLeft:'8px'
  },
  title: {
    fontSize: 16,
    textAlign: 'left',
    marginRight:'auto',
    paddingLeft:'10px',
    paddingTop:'15px',
    color:'#FFFFFF'
  },
  date:{
    fontSize: 12,
    color:'#FFFFFF',
    marginRight:'280px',
    paddingTop:'18px',
  },
  linkContainer: {
    marginLeft: 'auto',
  },
  link: {
    color: 'rgba(255, 132, 63, 1)',
    textAlign: 'right',
    marginLeft: 'auto'
  },
  section2: {
    flex: 0.5,
    flexDirection: 'row',
    marginBottom:'2px',
    maxHeight:'255px',
    marginTop:'3px',
    border:'1px solid #FFECE2'
  },
  section3: {
    flex: 0.2,
    flexDirection: 'row',
    backgroundColor:'#FFFFFF',
    marginBottom:'1px',
    marginTop:'4px',  
    maxHeight:'150px',  
  },
  section4: {
    flex: 0.2,
    flexDirection: 'column',
    border: '1px solid #FFECE2',
    marginTop:'4px',
    marginBottom:'4px'

  },
  section5:{
    flexDirection: 'row',
    justifyContent:'center'
  },
  logo: {
    width: 150,
    height: 150,
    objectFit:'contain',
  },
  image1: {
    width: '',
     height: "252px",
  },
  image2:{
    width: '',
    height: "250px",
  },
  heading1: {
    fontWeight: 'bold',
    fontSize:12,
    paddingLeft: '12px',
    fontStyle:'Open Sans',
    paddingTop:'5px'
  },
  noteContainer:{
    backgroundColor:"#FFECE2",
    height:'30px',
  },
  keyValue: {
    marginBottom: '3px',
  },
  column: {
    flexDirection: 'column',
    width: '80%',
    border: '1px solid #FFECE2',
  },
  heading: {
    fontWeight: 'bold',
    backgroundColor: '#FFECE2',
    fontSize: 12,
    textAlign: 'left',
    width: '100%',
    fontStyle:'Open Sans',
    height:'30px',
    paddingTop:'5px',
    paddingLeft: '12px'
  },
  keyValueContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  key: {
    width: '40%',
    fontSize:10,
    color:'#888888',
    paddingLeft: '8px',
    fontStyle:'Open Sans'
  },
  value: {
    width: '60%',
    fontSize:10,
    fontStyle:'Open Sans'
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
    
    const line1 = sanitizeValue(address.line1);
    const zipcode = sanitizeValue(address.zipcode);
    const city = sanitizeValue(address.city);
    const state = sanitizeValue(address.state);
    const country = sanitizeValue(address.country);
    const parts = [line1, city, state, country].filter(part => part !== '');
    return parts.join(', ') + (zipcode !== '' ? ', ' + zipcode : '');
};

  return (
    <Document>
      <Page size="A4">
        <View style={styles.container}>
        <View style={styles.section1}>
            <View>
            <Image style={styles.logo} src="https://constructn-attachments-us.s3.us-west-2.amazonaws.com/defaults/Full-Yellow.png" />
            </View>
            <View style={styles.linkContainer}>
             {downloadReportData && <Link style={styles.link} src={`${window.location.href}&context=${encodeURIComponent(downloadReportData?.context)}`}>View this location in ConstructN </Link>}
            </View>
            </View>
            <View style={styles.titleContainer}>  
            <Text style={{bottom:0,fontSize:16,fontStyle:'Open Sans',color:'#FFFFFF'}}>REPORT FOR {downloadReportData?.structure?.name.toUpperCase()} </Text> <Text style={{bottom:0,fontSize:12,fontStyle:'Open Sans',color:'#FFFFFF'}}>{`(${moment(downloadReportData?.snapshot?.date).format('MMMM Do YYYY')})`}</Text>
            </View>
            <View style={styles.section2}>
            {downloadReportData&&<Image style={styles.image1} src={downloadReportData.screenshot} />}
         
           {downloadReportData?.miniMapscreenshot ?<Image style={styles.image2} src={downloadReportData.miniMapscreenshot}/>:(<></>)}
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
                <Text style={styles.key}>Level:</Text>
               {downloadReportData?.hierarchy && <Text style={styles.value}>{downloadReportData?.hierarchy}</Text>}
              </View>
            </View>         
          </View>
          <View style={styles.section4}>
            <View style={styles.noteContainer}>
            <Text style={styles.heading1}>Notes</Text>
            </View>
          </View>
        </View>
        <View style={styles.section5}>
        <Text style={{bottom:0,fontSize:12,fontStyle:'Open Sans',color:'#888888'}}>Export Details: </Text> <Text style={{bottom:0,fontSize:12,fontStyle:'Open Sans'}}>{downloadReportData?.logedInUser}, {moment().format('MMMM Do YYYY, h:mm:ss a')}</Text>
        </View>
      </Page>
   </Document>
  );
};

export default GenerateReport;
