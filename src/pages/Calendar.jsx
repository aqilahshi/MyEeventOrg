import React, { useState, useEffect, useRef } from 'react';
import {
  ScheduleComponent,
  ViewsDirective,
  ViewDirective,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  Inject,
  Resize,
  DragAndDrop,
} from '@syncfusion/ej2-react-schedule';
import { Header } from '../components';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { collection, addDoc, getDocs, getFirestore } from 'firebase/firestore';
import { db } from '../firebase';

const Scheduler = () => {
  const scheduleRef = useRef(null);
  const [schedulerData, setSchedulerData] = useState([]);

  useEffect(() => {
    const fetchSchedulerData = async () => {
      const querySnapshot = await getDocs(collection(db, 'schedulerData'));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setSchedulerData(data);
    };

    fetchSchedulerData();
  }, []);

  const onEventSave = async (args) => {
    const eventData = args.data[0];
    const updatedData = [...schedulerData, eventData];
    setSchedulerData(updatedData);

    // Save event to the database
    const firestore = getFirestore();
    const schedulerDataRef = collection(firestore, 'schedulerData');
    await addDoc(schedulerDataRef, eventData);
  };

  const onEventChange = async (args) => {
    const updatedData = args.data;
    setSchedulerData(updatedData);

    // Update the database with the updated data
    const firestore = getFirestore();
    const schedulerDataRef = collection(firestore, 'schedulerData');

    // Delete existing documents
    const querySnapshot = await getDocs(schedulerDataRef);
    const batch = firestore.batch();
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Add new documents
    updatedData.forEach((item) => {
      const newDocRef = collection(schedulerDataRef).doc();
      batch.set(newDocRef, item);
    });

    await batch.commit();
  };

  const onDragStart = (args) => {
    args.navigation.enable = true;
  };

  const change = (args) => {
    scheduleRef.current.selectedDate = args.value;
    scheduleRef.current.dataBind();
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="Calendar" />
      <ScheduleComponent
        height="650px"
        ref={scheduleRef}
        selectedDate={new Date(2023, 5, 10)}
        eventSettings={{ dataSource: schedulerData, save: onEventSave, change: onEventChange }}
        dragStart={onDragStart}
      >
        <ViewsDirective>
          <ViewDirective option="Day" />
          <ViewDirective option="Week" />
          <ViewDirective option="WorkWeek" />
          <ViewDirective option="Month" />
          <ViewDirective option="Agenda" />
        </ViewsDirective>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
      </ScheduleComponent>
      <table style={{ width: '100%', background: 'white' }}>
        <tbody>
          <tr style={{ height: '50px' }}>
            <td style={{ width: '100%' }}>
              <DatePickerComponent
                value={new Date(2023, 6, 7)}
                showClearButton={false}
                placeholder="Current Date"
                floatLabelType="Always"
                change={change}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Scheduler;
