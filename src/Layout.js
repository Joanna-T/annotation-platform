import { Segment, Grid } from "semantic-ui-react";
import useWindowSize from "./useWindowSize";


const Layout = ({children}) => {
  const size = useWindowSize();

    return ( 
        <Grid padded style={{height: '100vh'}}>
  
        <Grid.Row style={{height: '100%'}}>
        <Grid.Column width={size.width > 600 ? 2 : 1}>
          </Grid.Column>
          <Grid.Column width={size.width > 600 ? 12 : 14}>
          
         {children}
  
              
          </Grid.Column>
          <Grid.Column width={size.width > 600 ? 2 : 1}>
          </Grid.Column>
        </Grid.Row>
      </Grid>
     );
}
 
export default Layout;

