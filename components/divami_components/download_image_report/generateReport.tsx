import React, { useEffect, useState} from 'react';
import { Document, Page, Text, StyleSheet,Image,View } from '@react-pdf/renderer';
import { IProjects } from '../../../models/IProjects';
import { IStructure } from '../../../models/IStructure';
import { ISnapshot } from '../../../models/ISnapshot';

const styles = StyleSheet.create({
    container: {
        padding: 50
    },
    text: {
        textAlign: 'justify'
    },
    view: {},
    image: {
      width: 200, // Adjust dimensions as needed
      height: 200
    }
});

interface IProps {
    project: IProjects,
    imageSrc:string,
    structure:IStructure
    snapshot:ISnapshot
}
const GenerateReport: React.FC<IProps> = ({ project,imageSrc }) => {
useEffect(()=>{

},[project,imageSrc])
  return (
      <Document>
    <Page style={styles.container} size={'A4'} >
      <View >
    <Text>
        Project  Details 
      </Text>
      <Text style={styles.text}>
      Name     : {project.name}
      Created  : {project.createdAt}
      </Text>
      <Image src={imageSrc} />
      </View>
    </Page>
  </Document>
  );
};

export default GenerateReport;
