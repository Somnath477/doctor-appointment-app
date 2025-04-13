import Head from 'next/head';
import dynamic from 'next/dynamic';

const AppointmentApp = dynamic(() => import('../components/AppointmentApp'), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>Doctor Appointment Booking</title>
      </Head>
      <AppointmentApp />
    </>
  );
}
