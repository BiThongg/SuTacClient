import React from 'react';
import OOutline from '../components/icons/OOutline';
import Btn from '@components/shared/Btn';
import Logo from '@components/shared/Logo';

function Room() {
  return (
    <section className="h-[70vh] w-full sm:w-[60%] lg:w-[40%] flex flex-col items-center justify-center gap-10">
      <Logo width={10} height={10} />

      <article className="bg-black-300 w-[90%] rounded-lg p-5 text-center">
        <h1 className="font-bold mb-5 text-lg">PICK PLAYER 1’S MARK</h1>

        <article className="bg-black-400 py-3 rounded-lg flex w-full mb-5">
        </article>

        <h3 className="text-gray-500">REMEMBER : X GOES FIRST</h3>
      </article>

      <article className="flex flex-col gap-3 w-[90%]">
        <div
          className="w-full bg-yellow-500 rounded-2xl pb-2"
        >
          <Btn classCSS="bg-yellow-400 rounded-2xl w-full" onClick={() => console.log("join room")}>
            Join Room
          </Btn>
        </div>

        <div
          className="w-[20%] bg-blue-500 rounded-2xl pb-2 cursor-auto"
          onClick={() => console.log('Create Room')}
        >
          <Btn classCSS="bg-blue-400 rounded-2xl w-full">
            Create Room
          </Btn>
        </div>
      </article>
    </section>
  );
}

export default Room;
