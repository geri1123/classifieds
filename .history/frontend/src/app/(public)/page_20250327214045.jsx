import HomeSearch from '@/components/homeComponents/HomeSearch';
import Slider from '@/components/homeComponents/Slider';
export default function Home() {
  return (
   <div className='px-20 bg-gray'>
   <Slider/>
   <HomeSearch/>
   </div>
  );
}
