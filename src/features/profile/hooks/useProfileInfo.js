import { useEffect, useState } from "react";
import supabase from "../../../lib/supabase";

export const useProfileInfo = () => {
	const [needsNameStep, setNeedsNameStep] = useState(true);
	const [isLoadingProfile, setIsLoadingProfile] = useState(true);
	const [error, setError] = useState(null);

	const loadProfile = async (userId) => {
		try {
			const { data, error: profileError } = await supabase
				.from("profiles")
				.select("first_name, last_name")
				.eq("id", userId)
				.maybeSingle();

			if (profileError) {
				throw profileError;
			}

			const hasFirstName = Boolean(data?.first_name?.trim());
			const hasLastName = Boolean(data?.last_name?.trim());
			setNeedsNameStep(!(hasFirstName && hasLastName));
			setError(null);
		} catch (err) {
			setError(err.message);
			setNeedsNameStep(true);
		} finally {
			setIsLoadingProfile(false);
		}
	};

	useEffect(() => {
		const init = async () => {
			if (!supabase) {
				setError("Supabase is not configured.");
				setIsLoadingProfile(false);
				setNeedsNameStep(true);
				return;
			}

			const { data: { session } } = await supabase.auth.getSession();

			if (session?.user?.id) {
				await loadProfile(session.user.id);
				return;
			}

			setNeedsNameStep(true);
			setIsLoadingProfile(false);
		};

		init();

		const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
			if (!session?.user?.id) {
				setNeedsNameStep(true);
				setIsLoadingProfile(false);
				return;
			}

			setIsLoadingProfile(true);
			await loadProfile(session.user.id);
		});

		return () => subscription.unsubscribe();
	}, []);

	return {
		needsNameStep,
		isLoadingProfile,
		error,
	};
};
