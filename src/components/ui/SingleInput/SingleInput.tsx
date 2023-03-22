import React, { FormEvent, useState } from "react";
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { ErrorMessage } from '@hookform/error-message';
import BaseButton from "../BaseButton/BaseButton";
import './SingleInput.scss';

type InputType = JSX.IntrinsicElements['input']['type']

type Inputs = {
  value: string;
};



interface IInputProps {
  type?: InputType,
  className?: string,
  onSubmit: (value: string) => void | Promise<void>,
  onChange?: (value: string) => void | Promise<void>,
  disabled?: boolean,
  mode?: string,
  buttonText: string,
  rules?: any,
  label?: string,
}

const defaultProps: Partial<IInputProps> = {
  type: "buttonText",
  className: '',
  onChange: () => {},
  disabled: false,
  mode: '',
  rules: yup.string().required()
};


export const SingleInput = ({ type, className, disabled, mode, onSubmit, onChange, buttonText, rules, label }: IInputProps) => {
  const [loading, setLoading] = useState(false);
  const schema = yup.object().shape({
    value: rules,
  }).required();
  const { register, handleSubmit, formState , resetField } = useForm<Inputs>({
    resolver: yupResolver(schema), // yup, joi and even your own.
  });
  const onSubmitWrapped = async ({ value }: {value: string}) => {
      setLoading(true);
      await onSubmit(value);
      resetField('value');
      setLoading(false);
  };
  const onChangeWrapper = async (event: FormEvent<HTMLFormElement>) => {
    // @ts-ignore
    await onChange(event.target.value);
  };
  const isDisabled = disabled || loading;
  return (
    <form className="base-input" onSubmit={handleSubmit(onSubmitWrapped)} onChange={onChangeWrapper}>
      {label && <div className="base-input__label">{label}</div>}
      <div className="base-input__row">
        <input
        disabled={isDisabled}
        type={type}
        className={`base-input__input base-input__input_${mode} base-input__input_${disabled} ${className}`}
        {...register("value")}
      />
        <BaseButton
          className="base-input__button"
          type="submit"
          mode="blue"
          disabled={isDisabled}
        >
          {buttonText}
        </BaseButton>
      </div>
      <div className="base-input__row base-input__row_error">
        <ErrorMessage
          errors={formState.errors}
          name="value"
          render={({ message }) => <p className="base-input__error">{message}</p>}
        />
      </div>
    </form>

  );
};

SingleInput.defaultProps = defaultProps;

export default SingleInput;
