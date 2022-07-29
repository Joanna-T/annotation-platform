import { Segment, Grid } from "semantic-ui-react";

const Layout = ({children}) => {
    return ( 
        <Grid padded style={{height: '100vh'}}>
  
        <Grid.Row style={{height: '100%'}}>
        <Grid.Column width={2}>
          </Grid.Column>
          <Grid.Column width={12}>
          
         {children}
  
              
          </Grid.Column>
          <Grid.Column width={2}>
          </Grid.Column>
        </Grid.Row>
      </Grid>
     );
}
 
export default Layout;