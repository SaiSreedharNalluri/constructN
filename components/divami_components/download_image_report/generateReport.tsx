import React, { useEffect, useState} from 'react';
import { Document, Page, Text, StyleSheet,Image,View } from '@react-pdf/renderer';
import { IProjects } from '../../../models/IProjects';
import html2canvas from 'html2canvas';

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
    project: IProjects
}
const GenerateReport: React.FC<IProps> = ({ project }) => {
  const[imageSrc,setImageSrc] =useState<string>('')
  useEffect(()=>{

  },[imageSrc,project])
  useEffect(()=>{
  captureCanvas()
  },[])
  const captureCanvas = () => {
    const element = document.getElementById("potreeViewer_1") || document.body;
    html2canvas(element).then(canvas => {
        const dataURL = canvas.toDataURL();
        setImageSrc(dataURL);
    }).catch(error => {
        console.error('Error capturing canvas:', error);
    });
};
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
