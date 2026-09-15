import { Column, Display, Image, Padding, Page, Row, Background, Footer, Copyright } from "@dasig";
import Card from "components/Card";
import "./index.sass";

export default () => {
  return (
      <Page title="OCBO Apps">
        
      <Display desktop tablet>
        <Background image="background2026" />
        
        <Row gap={0.5} content="left">
          <Image name="ocbo-portal" size={65} />
          <span class="logo-text">OCBO Apps Portal</span>
        </Row>

        <Row content="center">
          <span class="welcome">Welcome</span>
        </Row>

        <Row content="center">
          <Column>
            <h1 class="portal-title">Office of the City Building Official Application Portal</h1>
          </Column>
        </Row>

      

          <Row gap={2.5}>
            <Card
              image="esign"
              name="OCBO e-Sign"
              description="A secure way of signing permits"
              site="/esign"
            />
          </Row>
        </Display>

      <Display mobile>
        <Background image="background2026-mobile" />
          <Column gap={0.5} content="center">
            <Image name="ocbo-portal" size={120} />
            <span class="logo-text">OCBO Apps Portal</span>
          </Column>

          <Padding top={4} bottom={2} left={0} right={0}>
            <Column gap={1.5}>
              <Card
                image="logo"
                name="OCBO e-Sign"
                description="A secure way of signing permits"
                site="/esign"
              />
            </Column>
          </Padding>
      </Display>

      <Footer margin={1}>
        <section class="footer">
        <Row content="split">
          <Row gap={0.5}>
            <Image name="ocbologo" size={20} />
            <Row gap={0.25}>
              <Copyright />
              <span>Davao City, Philippines</span>
            </Row>
          </Row>

          <Row gap={1}>
            <Row gap={0.25}>
              <span>Developed by:</span>
              <Image name="pat-alcala" size={70} />
              <span>Pat Alcala</span>
            </Row>

            <Row gap={0.25}>
              <span>Made with:</span>
              <Image name="logo" size={10} />
              <span>Dasig</span>
            </Row>
          </Row>
          </Row>
        </section>
      </Footer>
    </Page>
  );
};
