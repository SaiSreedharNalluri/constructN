import * as React from "react";
import { styled } from "@mui/material/styles";
import {
  Container,
  GifContainer,
  Content,
  MainHeading,
  Paragraph,
} from "../components/divami_components/custom_loader/NoResultFoundStyles";

import NoRoute from "../public/divami_icons/NoRoute.svg";
import { LoaderImage } from "../components/divami_components/custom_loader/NoResultFoundStyles";

const NoResultFound = () => {
  return (
    <>
      <Container>
        <GifContainer>
          <LoaderImage src={NoRoute} alt="noimage" />
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
