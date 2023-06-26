import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Container,
  GifContainer,
  Content,
  MainHeading,
  Paragraph,
} from "../components/divami_components/custom_loader/NoResultFoundStyles";

import ErrorNotFound from "../public/divami_icons/ErrorNotFound.svg";
import { LoaderImage } from "../components/divami_components/custom_loader/NoResultFoundStyles";

const NoResultFound = () => {
  return (
    <>
      <Container>
        <GifContainer>
          <LoaderImage src={ErrorNotFound} alt="noimage" />
        </GifContainer>

        <Content>
          <MainHeading>404</MainHeading>
          <Paragraph>Page Not Found</Paragraph>
        </Content>
      </Container>
    </>
  );
};

export default NoResultFound;
