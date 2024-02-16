import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { IProjects } from '../../../models/IProjects';

const styles = StyleSheet.create({
    container: {
      padding: 50
    },
    text: {
      textAlign: 'justify'
    },
    view:{
      
    }
  });
interface IProps
{
  project:IProjects
}
const GenerateReport: React.FC<IProps> = ({project}) => {
  return (
    <Document>
    <Page style={styles.container}>
      <View >
    <Text>
        Project  Details 
      </Text>
      <Text style={styles.text}>
      Name     : {project.name}
      Created  : {project.createdAt}
      </Text>
      </View>
    </Page>
  </Document>
  );
};

export default GenerateReport;
