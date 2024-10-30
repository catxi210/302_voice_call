'use client'
import { useClientTranslation } from "@/app/hooks/use-client-translation";
import { Button } from "@/components/ui/button";
import DropupMenu from "@/components/ui/dropup-menu"
import { PersonalityValueCustom, PersonalityValueDefault } from "@/types";
import { useState } from "react"
import { FaChevronDown } from "react-icons/fa";

export const PersonalitySelector = (props: {
  defaultValue: string,
  onChange: (newValue: string) => void,
}) => {

  const { defaultValue, onChange } = props;

  const [value, setValue] = useState(defaultValue)

  const [open, setOpen] = useState(false);

  const { t } = useClientTranslation();

  const testPersonalityList = [
    {
      label: t("home:main.personality_list_label_default"),
      value: PersonalityValueDefault
    },
    {
      label: t("home:main.personality_list_label_custom"),
      value: PersonalityValueCustom
    }
  ]

  const onChangeValue = (newValue: string) => {
    setValue(newValue)
    setOpen(false)
    onChange(newValue)
  }

  const selectedItem = testPersonalityList.find(item => item.value === value) || testPersonalityList[0]
  const renderText = selectedItem.label
  return (
    <>
      <Button
        disabled={false}
        variant={"outline"}
        aria-label={renderText}
        onClick={() => setOpen(true)}
      >
        {renderText}
        <FaChevronDown className='size-2 ml-2' />
      </Button>
      <DropupMenu
        className="w-full max-w-screen-md h-1/5"
        open={open}
        onClose={() => setOpen(false)}
      >
        <div className="flex flex-1 flex-col justify-start">
          {testPersonalityList.map((item, index) => (
            <div
              key={index}
              className="justify-center border-gray-300 hover:border-purple-700 hover:text-purple-700 dark:hover:text-purple-500 dark:hover:border-purple-500 flex flex-row box-border p-2 pr-4 shadow rounded-xl border bg-card space-x-1 mb-3 cursor-pointer"
              onClick={() => onChangeValue(item.value)}
            >
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </DropupMenu>
    </>
  )
}
