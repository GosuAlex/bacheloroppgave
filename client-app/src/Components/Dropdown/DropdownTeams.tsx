import React, { useEffect, useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { ITeam } from 'Models/teams'

const friendOptions = [
  {
    key: 'Jenny Hess',
    text: 'Jenny Hess',
    value: 'Jenny Hess',
    image: { avatar: true, src: '/images/avatar/small/jenny.jpg' },
  },
  {
    key: 'Elliot Fu',
    text: 'Elliot Fu',
    value: 'Elliot Fu',
    image: { avatar: true, src: '/images/avatar/small/elliot.jpg' },
  },
  {
    key: 'Stevie Feliciano',
    text: 'Stevie Feliciano',
    value: 'Stevie Feliciano',
    image: { avatar: true, src: '/images/avatar/small/stevie.jpg' },
  },
  {
    key: 'Christian',
    text: 'Christian',
    value: 'Christian',
    image: { avatar: true, src: '/images/avatar/small/christian.jpg' },
  },
  {
    key: 'Matt',
    text: 'Matt',
    value: 'Matt',
    image: { avatar: true, src: '/images/avatar/small/matt.jpg' },
  },
  {
    key: 'Justen Kitsune',
    text: 'Justen Kitsune',
    value: 'Justen Kitsune',
    image: { avatar: true, src: '/images/avatar/small/justen.jpg' },
  },
]

interface PropsDetails {
  teams: ITeam[];
  setPickedTeam: (id: string | undefined) => void;
}

interface Options {
  key: string,
  text: string,
  value: string
}

const DropdownTeams: React.FC<PropsDetails> = ({teams, setPickedTeam}) => {

  const [allOptions, setAllOptions] = useState<Options[]>([]);
  const [firstValue, setFirstValue] = useState<Options>();

  useEffect(() => {
    const optionsArray: Options[] = [];
    teams.forEach(team => {
      const options: Options = {
        key: team.id,
        text: team.name,
        value: team.id,
        // image: team.image
      }; 
      optionsArray.push(options);
    });
    setFirstValue(optionsArray[0])
    setAllOptions(optionsArray);
  }, [teams])

  return (
  <Dropdown
    placeholder='Velg Team'
    fluid
    selection
    options={allOptions}
    onChange={(e, data) => setPickedTeam(data.value?.toString())}
  />
  )
}

export default DropdownTeams