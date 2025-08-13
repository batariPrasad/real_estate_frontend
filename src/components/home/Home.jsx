
import Carousel from "../carousel/carousel";
import GetAllProperties from "../allproperties/getlProperties/GetAllProperties";
import Footer from "../../layout/Footer";


const Home = () => {

    return(
        <div className="">
            <Carousel/>
            <GetAllProperties/>
            <Footer/>
        </div>
    )

}

export default Home;