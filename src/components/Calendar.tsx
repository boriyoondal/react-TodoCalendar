import dayjs from 'dayjs';
import React, { createContext, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // css import
import '../Calendar.css';

export interface DateType {
   value: string;
   onChange: React.Dispatch<any>;
}

export const DateContext = createContext<any>(null);

export default function DateStore(props: any) {
   const [value, onChange] = useState(new Date());

   return (
      <div>
         <div className="text-center">
            <DateContext.Provider value={{ value, onChange }}>
               {props.children}
            </DateContext.Provider>
         </div>
      </div>
   );
}
