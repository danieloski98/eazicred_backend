import * as joi from 'joi';

export const SMEvalidationObject = joi.object({
  user_id: joi.string().required(),
  business_name: joi.string().required(),
  business_address: joi.string().required(),
  RC_number: joi.string().required(),
  TIN_number: joi.string().required(),
  business_up_time: joi.string().required(),
  purpose_of_loan: joi.string().required(),
});
