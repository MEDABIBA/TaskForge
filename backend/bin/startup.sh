# --- bin/startup.sh ---
npx prisma generate
# npx prisma migrate deploy
npx prisma db push
yarn run dev
