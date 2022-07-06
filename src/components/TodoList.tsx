/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import axios from 'axios';
import { useQuery } from 'react-query';
import DateStore, { DateContext } from './Calendar';
import Calendar from 'react-calendar';
// type
import { DataType } from '../type';
// css
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

export const fetchList = async () => {
   const { data } = await axios.get(`http://localhost:8000/datas`);
   return data;
};

export default function TodoListComponent() {
   const context = useContext(DateContext);
   const { value, onChange } = context;
   console.log(dayjs(context?.value).format('YYYY년 M월 DD일'));

   const { isLoading, isError, data, error } = useQuery<DataType[]>(
      'todos',
      fetchList,
      {
         onSuccess: data => {
            console.log(data);
         },
         onError: e => {
            console.log(e);
         },
      },
   );

   const [check, setCheck] = useState(false);
   const [modal, setModal] = useState(false);
   const type = ['종류', '돈방', '두수', '상태', ''];
   const workType = ['입식(+)', '출하(-)', '전입(+)', '전출(-)', '폐사(-)'];

   if (isLoading) {
      return <span> Loading... </span>;
   }

   if (isError) {
      return <span>Error</span>;
   }

   const checkHandler = (v: number) => {
      if (v) {
         setCheck(true);
      }
   };

   return (
      <div>
         {/* <Calendar /> */}
         <div className="flex justify-center items-center min-h-screen bg-[#cbd7e3]">
            <DateStore>
               <div
                  css={css`
                     width: 800px;
                     height: auto;
                     background-color: #fff;
                     padding: 1rem;
                  `}>
                  <div className="flex justify-between">
                     {workType.map((v, i) => (
                        <div key={i}>
                           <div className="align-baseline mr-5 ml-5 p-4">
                              {v}:
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <Calendar
                  value={value}
                  onChange={onChange}
                  className="mr-4"
                  formatDay={(locale, date) => dayjs(date).format('DD')}
                  onClickMonth={() =>
                     console.log(
                        data?.filter(
                           v =>
                              dayjs(new Date(v.date)).month() ===
                              dayjs(context.value).month(),
                        ),
                     )
                  }
                  maxDetail="month"
                  tileContent={({ date, view }) =>
                     data?.find(
                        v => v.date === dayjs(date).format('YYYY-MM-DD'),
                     ) ? (
                        <div className="flex justify-center items-center absoluteDiv">
                           <div
                              css={css`
                                 height: 8px;
                                 width: 8px;
                                 background-color: #f87171;
                                 border-radius: 50%;
                                 display: flex;
                                 margin-left: 1px;
                              `}></div>
                        </div>
                     ) : null
                  }
               />
            </DateStore>
            <div className="h-auto w-96 bg-white rounded-lg p-4">
               <div className="mt-3 pl-1 text-sm text-[#8ea6c8] flexn items-center">
                  <p className="set_time">
                     {dayjs(context.value).format('M월')}
                  </p>
                  <p className="text-xl py-2 font-semibold text-[#063c76]">
                     작업 목록
                  </p>
                  {context.value ? (
                     <p className="mb-3">
                        {dayjs(context.value).format('YYYY년 M월 DD일')}
                     </p>
                  ) : null}
               </div>

               <div className="relative overflow-x-auto shadow-md mb-2">
                  <table className="w-full text-sm text-gray-500 dark:text-gray-400 text-center">
                     <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                           {type.map((v, i) => (
                              <th scope="col" className="px-3 py-2" key={i}>
                                 {v}
                              </th>
                           ))}
                        </tr>
                     </thead>
                     <tbody>
                        {data
                           ?.filter(
                              v =>
                                 dayjs(new Date(v.date)).date() ===
                                    dayjs(context.value).date() &&
                                 dayjs(new Date(v.date)).month() ===
                                    dayjs(context.value).month(),
                           )
                           ?.map((v: DataType) => (
                              <tr
                                 key={v.id}
                                 className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                 // 완료처리 CSS
                                 // css={check ? Style.CheckStyle : null}
                              >
                                 <th
                                    scope="row"
                                    className="px-3 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                                    {v.variable}
                                 </th>
                                 <td className="px-3 py-2">{v.room}</td>
                                 <td className="px-3 py-2">{v.numbers}</td>
                                 <td className="px-3 py-2">
                                    <input
                                       type="radio"
                                       onClick={() => checkHandler(v.id)}
                                    />
                                 </td>
                                 <td
                                    className="px-3 py-2 text-right"
                                    onClick={() =>
                                       data?.filter(v => v.id !== v.id)
                                    }>
                                    <a
                                       href="#"
                                       className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                       삭제
                                    </a>
                                 </td>
                              </tr>
                           ))}
                     </tbody>
                  </table>
               </div>

               <div className="flex justify-center">
                  <div className="p-1 m-1">
                     <button
                        onClick={() => setModal(true)}
                        className="block  text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        type="button"
                        data-modal-toggle="defaultModal">
                        작업 추가
                     </button>
                  </div>
               </div>
            </div>
         </div>

         {/* submit modal */}
         {modal ? (
            <div
               css={css`
                  left: 27.5%;
               `}
               id="defaultModal"
               data-modal-show="true"
               aria-hidden="false"
               className=" fixed top-50 left-60 z-50 w-full md:inset-0 h-modal md:h-full">
               <div className="relative p-4 w-full max-w-xl h-full md:h-auto">
                  <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                     <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                           작업 등록
                        </h3>
                        <button
                           onClick={() => setModal(!modal)}
                           type="button"
                           className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                           data-modal-toggle="defaultModal">
                           <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg">
                              <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path>
                           </svg>
                        </button>
                     </div>

                     <div className="flex justify-between p-2 m-2">
                        <select
                           name="종류"
                           className="flex w-1/2 text-center border-2 h-10 mr-2">
                           <option value="">작업 종류</option>
                        </select>
                        <select
                           name="세부작업"
                           className="flex w-1/2 text-center border-2 h-10">
                           <option value="">세부 작업(선택)</option>
                        </select>
                     </div>
                     <div className="flex p-2 m-2">
                        <select
                           name="돈사"
                           className="flex w-1/2 text-center border-2 h-10 mr-2">
                           <option value="">돈사</option>
                        </select>
                        <select
                           name="돈방"
                           className="flex w-1/2 text-center border-2 h-10">
                           <option value="">돈방</option>
                        </select>
                     </div>
                     <div className="flex  p-2 m-2 text-center">
                        <select
                           name="품종"
                           className="flex w-1/2 mr-2 text-center border-2 h-10">
                           <option value="">품종</option>
                        </select>

                        <select
                           name="성장단계"
                           className="flex w-1/2 text-center border-2 h-10">
                           <option value="">성장단계</option>
                        </select>
                     </div>
                     <div className="flex  p-2 m-2 ">
                        <select
                           name="일령"
                           className="flex w-1/2 mr-2 text-center border-2 h-10">
                           <option value="">일령</option>
                        </select>
                        <input
                           type="text"
                           placeholder="두수"
                           className="block w-1/2 xl:text-sm  text-center text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                     </div>
                     <div className="flex p-2 m-2 ">
                        <input
                           type="text"
                           placeholder="무게"
                           className="block w-1/2 mr-2 xl:text-sm  text-center text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />

                        <input
                           type="time"
                           className="block w-1/2   h-10 text-center xl:text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                     </div>
                     <div className="justify-center  p-2 m-2">
                        <input
                           type="text"
                           placeholder="특이사항"
                           className="flex w-full xl:text-sm  h-10 text-center text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        />
                     </div>

                     <div className="flex justify-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
                        <button
                           data-modal-toggle="defaultModal"
                           type="button"
                           className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                           등록
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         ) : null}
      </div>
   );
}

const Style = {
   ModalStyle: css`
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      max-height: 80%;
      width: 35%;
      height: 40%;
      /* padding: 16px; */
      background: #cbd7e3;
      border-radius: 10px;
      text-align: center;
      z-index: 1;
      color: rgb(43, 24, 24);
      background: white;
      padding: 1rem;
      border: 1px solid #ccc;
      box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
   `,

   CheckStyle: css`
      opacity: 50%;
   `,
};
